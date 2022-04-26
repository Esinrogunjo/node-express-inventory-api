import { Document } from "mongoose";
export type genderType = "male" | "female";
export type userType = "Manager" | "Accountant" | "Cashier" | "StoreKepper";

export type permissionType = "";
export interface ISession extends Document {
  used: number;
  sessionId: string;
  deviceHash: string;
  lastEventTime: Date;
  maxLivespan: number;
  maxInactivity: number;
  isLoggedOut?: boolean;
  device: {
    info: string;
    geoip: {
      lat: string;
      long: string;
    };
  };
}

export interface SessionI {
  used: number;
  sessionId: string;
  deviceHash: string;
  lastEventTime: Date;
  maxLivespan: number | string;
  maxInactivity: number | string;
  isLoggedOut?: boolean;
  device: {
    info: string;
    geoip: {
      lat: string;
      long: string;
    };
  };
}
