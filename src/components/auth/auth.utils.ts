import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IToken } from "./access.model";
export const hashWord = (text: string): string => bcrypt.hashSync(text, 10);

export const checkHash = (text: string, hash: string): boolean => {
  return bcrypt.compareSync(text, hash);
};

export const generateToken = (data: IToken, expiresIn = "3 days") => {
  const token = jwt.sign(data, process.env.SECRET_KEY || "123westend", {
    expiresIn: expiresIn,
    issuer: `STK-Enviroment`,
  });
  return token;
};

export const verifyToken = (token: any) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(
      token,
      process.env.SECRET_KEY || "123westend",
      (error: any, decoded: any) => {
        if (error) reject(error);
        resolve(decoded);
      }
    );
  });
};
