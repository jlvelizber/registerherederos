import yup from "../config/yup.config";
import { CustomValidations } from "../utils/CustomValidations";

CustomValidations();

export const KidRequestSchemaOnSave = yup.object().shape({
  name: yup.string().required().min(3).max(60),
  identification: yup
    .string()
    .verifyIdentification()
    .uniqueKidIdentification("La cédula del niño ya existe")
    .required(),
  lastname: yup.string().required().min(3).max(60),
  date_born: yup.date().required(),
  parent_name: yup.string().required().min(3).max(60),
  parent_lastname: yup.string().required().min(3).max(60),
  parent_email: yup.string().email().min(3).max(120),
  parent_phone: yup.string().required().min(10).max(10),
});