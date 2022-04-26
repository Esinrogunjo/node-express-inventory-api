import bcrypt from "bcryptjs";

export const hashWord = (text: string): string => bcrypt.hashSync(text, 10);

export const checkHash = (text: string, hash: string): boolean => {
  return bcrypt.compareSync(text, hash);
};
