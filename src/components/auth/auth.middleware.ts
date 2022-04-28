import { NextFunction, Response } from "express";
import Access from "./access.model";
import { verifyToken } from "./auth.utils";
import { IRequest } from "./access.model";
import { StatusCodes } from "http-status-codes";
import { consloeLog } from "../../utils/helpers";

const validateToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers.token ||
    req.headers.Authorization;

  if (!token) return next();
  if (Array.isArray(token)) token = token[0];
  token = token.replace("Bearer ", "");

  try {
    const decoded: any = await verifyToken(token);
    req.decoded = decoded;
    return next();
  } catch (error: any) {
    if (error.name) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: error.message });
      } else if (error.name == "TokenExpiredError") {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Expired Session, kindly re-login", error });
      }
    }
  }
};

export const requireAuth = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.decoded)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  const { sessionId, ref, authKey } = req.decoded;
  try {
    const access = await Access.findOne({ user: ref });
    if (!access)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization fail" });

    if (access.isBlocked)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You have been banned. Contact support" });

    //find session index
    const sessionIndex = await access.sessions.findIndex(
      (sesn) => sesn.sessionId === sessionId
    );

    const session = access.sessions[sessionIndex];
    if (!session)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Invalid Session. Kindly login " });

    if (session.isLoggedOut)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Session Logged out, kindly login" });
    const fingerprint: any = req.fingerprint;
    const { hash: deviceHash } = fingerprint;
    if (session.deviceHash !== deviceHash) {
      consloeLog(`${deviceHash}:${session.deviceHash}`);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message:
          "session expired | session deviceHash does not match with request deviceHash",
      });
    }

    //enforce maximum inactivity
    if (
      new Date().getTime() - new Date(session.lastEventTime).getTime() >
      session.maxInactivity
    )
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "session expired, knidly login",
      });

    // enforce maximum session lifespan
    if (
      new Date().getTime() - new Date(session.lastEventTime).getTime() >
      session.maxLivespan
    )
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "session expired, knidly login",
      });

    // ensure security key is intact
    if (authKey !== access.accessKeys?.securityCode)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "session expired, knidly login",
      });

    req.userId = access.user;
    req.canAccess = access.canAccess;

    access.sessions[sessionIndex].lastEventTime = new Date();
    await access.save();
    return next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication error", error });
  }
};
