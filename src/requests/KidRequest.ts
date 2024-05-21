import yup from "../config/yup.config";
import { CustomValidations } from "../utils/CustomValidations";

CustomValidations();

export const KidRequestSchemaOnSave = yup.object().shape({
  name: yup.string().required().min(3).max(60),
  identification: yup
    .string()
    .verifyIdentification("Identificación inválida")
    .uniqueKidIdentification("La cédula del niño ya existe")
    .required(),
  lastname: yup.string().required().min(3).max(60),
  date_born: yup.string().required("Fecha de nacimiento requerida"),
  parent_name: yup.string().required().min(3).max(60),
  parent_lastname: yup.string().required().min(3).max(60),
  parent_email: yup.string().nullable().email(),
  parent_phone: yup.string().required(),
});

export const KidRequestSchemaOnUpdate = yup.object().shape({
  name: yup.string().required().min(3).max(60),
  identification: yup
    .string()
    // .verifyIdentification("Identificación inválida")
    // .uniqueKidIdentification("La cédula del niño ya existe")//  TODO: AQUI HAY QUE VOLVER A ACTIVARLA PERO CON LA CONDICION QUE DEBE MEJORAR LA VALIDACION DE QUE NO TOME EN CUENTA SU PROPIO ID
    .required(),
  lastname: yup.string().required().min(3).max(60),
  date_born: yup.string().required("Fecha de nacimiento requerida"),
  parent_name: yup.string().required().min(3).max(60),
  parent_lastname: yup.string().required().min(3).max(60),
  parent_email: yup.string().nullable().email(),
  parent_phone: yup.string().required(),
});