import { v4 as uuidv4 } from "uuid";
import { NODE_ENV } from "./config";
import logger from "./logger";

export const consloeLog = (message: string, forced?: boolean) => {
  if (forced) logger.info(message);
  else if (NODE_ENV === "dev") logger.info(message);
};
export const generateId = (): string => {
  return uuidv4();
};
