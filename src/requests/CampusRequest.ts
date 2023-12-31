import { Campus } from "@prisma/client";
import yup from "../config/yup.config";

export const CampusRequest = yup.object<Campus>().shape({
  name: yup.string().required().min(3).max(60),
  code_name: yup.string().required().min(3).max(30),
  address: yup.string().required().min(3),
});
