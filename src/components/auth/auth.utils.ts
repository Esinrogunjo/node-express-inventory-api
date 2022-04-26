import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
export const hashWord = (text: string): string => bcrypt.hashSync(text, 10);

export const checkHash = (text: string, hash: string): boolean => {
  return bcrypt.compareSync(text, hash);
};

export const generateToken = (payload: any) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY || "123westend", {
    expiresIn: "3 days",
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
