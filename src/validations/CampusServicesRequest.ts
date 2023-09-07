import yup from "../config/yup.config";

export const CampusServicesRequest = yup.object().shape({
  campus_id: yup.string().required(),
  description: yup.string().required(),
  start_hour: yup.string().required(),
  end_hour: yup.string().required(),
});
