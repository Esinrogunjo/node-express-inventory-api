import { Document, Schema, model } from "mongoose";
import { IEmployee } from "../user/user.model";
import { ISession, permissionType, SessionI } from "../../utils/types";
import { hashWord } from "./auth.utils";
const { Mixed, ObjectId } = Schema.Types;

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
  sessions: (ISession | SessionI)[];
}

const accessSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
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