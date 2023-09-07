import { Campus as CampusPrismaModel } from "@prisma/client";
import yup from "./../config/yup.config";

export const CampusRequest = yup.object<CampusPrismaModel>().shape({
  name: yup.string().required().min(3).max(60),
  code_name: yup.string().required().min(3).max(30),
  address: yup.string().required().min(3),
});
