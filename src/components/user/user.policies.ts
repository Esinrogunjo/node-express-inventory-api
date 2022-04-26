import { NextFunction, Request, Response } from "express";
import joi from "joi";

export const validCreateEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const employeeSchema = joi.object({
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().email().required(),
    gender: joi.string().min(2).required(),
    password: joi.string().min(4).required(),
  });
  const { error } = employeeSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error });
  }
  return next();
};
