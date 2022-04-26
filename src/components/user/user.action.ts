import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { consloeLog, generateId } from "../../utils/helpers";
import Access from "../auth/access.model";
import { checkHash, generateToken } from "../auth/auth.utils";
import { Employee } from "./user.model";

export const doCreateEmployee = async (req: Request, res: Response) => {
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

export const doLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password" });
    }
    const access = await Access.findOne({ user: user._id });
    if (!access) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password or access" });
    }
    if (!checkHash(password, access.password))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "invalid email or password please check" });

    const token = generateToken({
      user: user.firstName + user.lastName,
      email: user.email,
      uniquId: user.uniqueId,
    });

    // check if session exists
    // if it exists, incremented no of times it was used, update lastLogin, isLoggedOut: false, other relevant fields
    // if it doesn't, that means the device or some other things are new, so create new

    return res.status(StatusCodes.OK).json({
      token,
      message: "welcome back man",
      user: {
        username: user.firstName + user.lastName,
        uniqueId: user.uniqueId,
      },
    });
  } catch (error) {
    res.json({ message: "could not  login", error });
  }
};
