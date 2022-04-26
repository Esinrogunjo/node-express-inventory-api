import express, {
  Application,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import "dotenv/config";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import mongoose from "mongoose";
import { consloeLog } from "./utils/helpers";
//import { DB_URL } from "./utils/config";
import userRoute from "./components/user/user.route";
import seedNow from "./utils/seed";
const dbUrl = process.env.DB_URL || "";

const app: Application = express();
app.use(json());
app.use(helmet());
app.use(urlencoded());
app.use(cors());
app.use("/api/users", userRoute);
mongoose
  .connect(dbUrl, {})
  .then(() => {
    consloeLog("database connected !!!", true);
    seedNow();
  })
  .catch((error) => console.error(error));

app.get("/", (_req: Request, res: Response) => {
  res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Inital/Default route hitted" });
});

export default app;
