import { Document, Schema, model, ObjectId as ObjId } from "mongoose";
import { IEmployee } from "../user/user.model";
import { ISession, permissionType, SessionI } from "../../utils/types";
import { hashWord } from "./auth.utils";
const { Mixed, ObjectId } = Schema.Types;
import { FingerprintResult } from "express-fingerprint";
import { Request } from "express";

export interface IRequest extends Request {
  userId?: ObjId;
  fingerprint?: FingerprintResult;

  decoded?: IDecodedTokenData;
  permissions?: string[];
  canAccess?: string[];
}

export interface IDecodedTokenData {
  deviceId?: string;
  sessionId?: string;
  ref?: IEmployee["_id"];
  authKey?: string;
  securityCode?: string;
}
export interface IToken {
  deviceId: string;
  sessionId: string;
  ref: ObjId;
  authKey: string;
}

export interface IAccess extends Document {
  user: IEmployee["id"];
  permissions: permissionType[];
  password: string;
  accesskeys: {
    passResetCode: string;
    verificationCode: string;
    securityCode: string;
    totpSecret: any;
  };
  otp: {
    code: string;
    expiresBy: Date;
    purpose: "passReset" | "verification" | "sensitiveUpdate";
  };
  canAccess: string[];
  subscriptionEnds?: Date;
  isActivated: boolean;
  isBlocked?: boolean;
  lastLogin: Date;
  lastLoginAttempt: Date;
  sessions: (ISession | SessionI)[];
}

const accessSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "Employee",
    },
    permissions: [String],
    password: {
      type: String,
      required: true,
    },
    accesskeys: {
      passResetCode: String,
      verificationCode: String,
      securityCode: String,
      totpSecret: Mixed,
    },
    otp: {
      code: String,
      expiresBy: Date,
      purpose: {
        type: String,
        enum: ["passReset", "verification", "sensitiveUpdate"],
      },
    },
    canAccess: [String],
    subscriptionEnds: Date,
    isActivated: Boolean,
    isBlocked: Boolean,
    lastLogin: Date,
    lastLoginAttempt: Date,
    sessions: [
      {
        used: Number,
        sessionId: String,
        deviceHash: String,
        lastEventTime: Date,
        maxLivespan: Number,
        maxInactivity: Number,
        isLoggedOut: Boolean,
        device: {
          info: String,
          geoip: {
            lat: String,
            long: String,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

accessSchema.pre("save", function (this: IAccess, next) {
  if (this.isModified("password")) this.password = hashWord(this.password);

  return next();
});

const Access = model<IAccess>("Access", accessSchema);

export default Access;
