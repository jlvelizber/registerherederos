import { Campus } from "@prisma/client";
import yup from "../config/yup.config";

import { CustomValidations } from "../utils";

CustomValidations();

export const RegisterRequest = yup.object<Campus>().shape({
  register_user_id: yup.number().required().existUser("Usuario inexistente"),
  kid_id: yup.number().required().existKid("Ninio  inexistente").sameKidAgain("Registro repetido, el niño ya asistió a este servicio"),
  service_id: yup.number().required().existService("Servicio inexistente"),
});
