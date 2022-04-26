import { Document, model, Schema } from "mongoose";
import { genderType, userType } from "../../utils/types";
const { Mixed } = Schema.Types;
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  gender: genderType;
  contact: Array<{
    countryCode: string;
    phoneNo: string;
    street: string;
    suite: string;
    city: string;
    province: string;
    country: string;
  }>;
}

export interface IEmployee extends IUser {
  level: string;
  roles: userType;
}

export interface ICustomer extends IUser {
  crediLimit: number;
}
export interface ISupplier extends IUser {
  companyName: string;
  rebateAmount: number;
  bankDetails: Array<{
    country: string;
    bankName: string;
    bankBranch: string;
    routingNo: string;
    sortCode: string;
    accountNo: string;
    accountName: string;
    currency: string;
    meta: any;
  }>;
}

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    contacts: [
      {
        countryCode: String,
        phoneNo: String,
        street: String,
        suite: String,
        city: String,
        province: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    crediLimit: {
      type: String,
    },

    contacts: [
      {
        countryCode: String,
        phoneNo: String,
        street: String,
        suite: String,
        city: String,
        province: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const supplierSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },

    contacts: [
      {
        countryCode: String,
        phoneNo: String,
        street: String,
        suite: String,
        city: String,
        province: String,
        country: String,
      },
    ],
    bankDetails: [
      {
        country: String,
        bankName: String,
        bankBranch: String,
        routingNo: String,
        sortCode: String,
        accountNo: String,
        accountName: String,
        currency: String,
        meta: Mixed,
      },
    ],
  },
  { timestamps: true }
);
export const Supplier = model<ISupplier>("Supplier", supplierSchema);
export const Customer = model<ICustomer>("Customer", customerSchema);
export const Employee = model<IEmployee>("Employee", employeeSchema);
