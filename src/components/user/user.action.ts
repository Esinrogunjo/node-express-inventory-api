import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { consloeLog, generateId } from "../../utils/helpers";
import Access from "../auth/access.model";
import { Employee } from "./user.model";

export const doCreateEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, email, gender, password } = req.body;

  try {
    const employeeExist = await Employee.findOne({ email });
    if (employeeExist) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already taken" });
    }

    const newEmployee = await new Employee({
      firstName,
      lastName,
      email,
      gender,
    }).save();
    await new Access({
      user: newEmployee._id,
      password,
      accessKeys: {
        securityCode: generateId(),
      },
    }).save();

    return res.status(StatusCodes.CREATED).json({
      message: "employee created successfully",
      user: newEmployee,
    });
  } catch (error: any) {
    consloeLog(error, true);
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: `could not create user ${error}` });
  }
};
