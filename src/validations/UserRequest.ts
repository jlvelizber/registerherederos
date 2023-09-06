import yup from "./../config/yup.config";
import { CustomValidations } from "./CustomValidations";


CustomValidations()

export const UserRequestSchemaOnSave = yup.object().shape({
  name: yup.string().required().min(3).max(60),
  email: yup.string().email().min(3).max(120).uniqueUserEmail("Correo existente"),
  password: yup.string().required().min(3).max(60),
});
