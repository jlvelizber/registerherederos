import { Campus as CampusPrismaModel } from "@prisma/client";
import yup from "./../config/yup.config";

import { CustomValidations } from "./CustomValidations";

CustomValidations();

export const RegisterRequest = yup.object<CampusPrismaModel>().shape({
  register_user_id: yup.number().required().existUser("Usuario inexistente"),
  kid_id: yup.number().required().existKid("Ninio  inexistente"),
  service_id: yup.number().required().existService("Servicio inexistente"),
});
