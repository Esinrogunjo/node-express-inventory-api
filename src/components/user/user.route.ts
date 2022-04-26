import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { doCreateEmployee } from "./user.action";
import { validCreateEmployee } from "./user.policies";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Inital user route created" });
});
router.post("/", validCreateEmployee, doCreateEmployee);

export default router;
