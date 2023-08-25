import { Kid as KidPrismaModel } from "@prisma/client";
import yup from "./../config/yup.config";
import { CustomValidations } from "./CustomValidations";

CustomValidations();

export const KidRequestSchema = yup.object<KidPrismaModel>().shape({
  name: yup.string().required().min(3).max(60),
  identification: yup.string().verifyIdentification().required(),
  lastname: yup.string().required().min(3).max(60),
  email: yup.string().email().min(3).max(120),
  parent_name: yup.string().required().min(3).max(60),
  parent_lastname: yup.string().required().min(3).max(60),
  parent_email: yup.string().email().min(3).max(120),
  parent_phone: yup.string().required().min(10).max(10),
});
