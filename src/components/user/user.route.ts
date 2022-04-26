import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { doCreateEmployee, doLogin } from "./user.action";
import { validateLogin, validCreateEmployee } from "./user.policies";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Inital user route created" });
});
router.post("/register", validCreateEmployee, doCreateEmployee);
router.post("/login", validateLogin, doLogin);
export default router;
