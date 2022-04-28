import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { authConfigs } from "../../utils/config";
import { consloeLog, generateId } from "../../utils/helpers";
import { ISession, SessionI } from "../../utils/types";
import Access, { IRequest } from "../auth/access.model";
import { checkHash, generateToken } from "../auth/auth.utils";
import { Employee } from "./user.model";

export const doCreateEmployee = async (req: IRequest, res: Response) => {
  const { firstName, lastName, email, gender, password } = req.body;

  try {
    const employeeExist = await Employee.findOne({ email });
    if (employeeExist) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already taken" });
    }

    const newEmployee = await new Employee({
      firstName,
      lastName,
      email,
      gender,
      uniqueId: generateId(),
    }).save();
    await new Access({
      user: newEmployee._id,
      password,
      accessKeys: {
        securityCode: generateId(),
      },
    }).save();

    return res.status(StatusCodes.CREATED).json({
      message: "employee created successfully",
      user: newEmployee,
    });
  } catch (error: any) {
    consloeLog(error, true);
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: `could not create user ${error}` });
  }
};

export const doLogin = async (req: IRequest, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password" });
    }
    const userAccess = await Access.findOne({ user: user._id });
    if (!userAccess) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password or access" });
    }
    if (!checkHash(password, userAccess.password))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password please check" });

    // check if session exists
    // if it exists, incremented no of times it was used, update lastLogin, isLoggedOut: false, other relevant fields
    // if it doesn't, that means the device or some other things are new, so create new

    const fingerprint: any = req.fingerprint;
    const {
      hash: deviceHash,
      components: {
        useragent: { browser, os },
        geoip,
      },
    } = fingerprint;

    const session: SessionI | ISession = userAccess.sessions?.find(
      (sesn) => sesn.deviceHash === deviceHash
    ) || {
      used: 2,
      sessionId: generateId(),
      deviceHash,
      lastEventTime: new Date(),
      maxLivespan: ms(authConfigs.sessionLivespan),
      maxInactivity: ms(authConfigs.maxInactivity),
      device: {
        info: `${browser.family}  ${browser.version} on ${os.family} ${os.major}`,
        geoip,
      },
    };

    const sessionIndex: number = userAccess.sessions.findIndex(
      (sesn) => sesn.deviceHash === deviceHash
    );

    if (sessionIndex !== -1) {
      session.used += 1;
      session.lastEventTime = new Date();
      session.maxLivespan = ms(authConfigs.sessionLivespan);
      session.maxInactivity = ms(authConfigs.maxInactivity);
      session.isLoggedOut = false;
      userAccess.sessions[sessionIndex] = session;
    } else {
      userAccess.sessions[sessionIndex] = session;
    }
    userAccess.lastLogin = new Date();
    await userAccess.save();

    const token = generateToken(
      {
        ref: user._id,
        deviceId: deviceHash,
        sessionId: session.sessionId,
        authKey: userAccess.accesskeys.securityCode,
      },
      authConfigs.sessionLivespan
    );

    return res.status(StatusCodes.OK).json({
      token,
      message: "welcome back man",
      user: {
        username: user.firstName + user.lastName,
        uniqueId: user.uniqueId,
        hash: deviceHash,
        browser,
        os,
        geoip,
      },
    });
  } catch (error) {
    res.json({ message: "could not  login", error });
  }
};
