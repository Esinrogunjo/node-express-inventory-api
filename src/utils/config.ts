import { genderType } from "./types";

import("dotenv/config");

export const PORT = process.env.PORT || 4040;
export const DB_URL = process.env.DB_URL || "";
export const NODE_ENV = process.env.NODE_ENV || "dev";

export const seedData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: genderType;
} = {
  firstName: process.env.SEED_USER_FIRST_NAME || "",
  lastName: process.env.SEED_USER_LAST_NAME || "",
  email: process.env.SEED_USER_EMAIL || "",
  password: process.env.SEED_USER_PASSWORD || "",
  gender: (process.env.SEED_USER_GENDER || "male") as genderType,
};
