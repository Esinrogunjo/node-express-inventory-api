import Access from "../components/auth/access.model";
import { Employee } from "../components/user/user.model";
import { seedData } from "./config";
import { consloeLog, generateId } from "./helpers";

const seedNow = async () => {
  try {
    const employeeExist = await Employee.findOne();
    if (employeeExist) return;
    consloeLog("seeding in progress", true);
    const { firstName, lastName, email, gender, password } = seedData;
    const seedEmployee = await new Employee({
      firstName,
      lastName,
      email,
      gender,
    }).save();
    await new Access({
      user: seedEmployee._id,
      password,
      accessKeys: {
        securityCode: generateId(),
      },
    }).save();
    consloeLog("seeding completed successfully", true);
  } catch (error: any) {
    consloeLog(error, true);
  }
};

export default seedNow;
