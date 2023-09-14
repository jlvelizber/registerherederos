import * as Yup from "yup";
import {
  ValidateIdentification,
  existEmail,
  existIdentification,
  invalidIdentification,
  notFound,
  sameKidInSameDay,
} from ".";
import KidModel from "../models/Kid.model";
import UserModel from "../models/User.model";
import CampusServicesModel from "../models/CampusServices.model";
import RegisterModel from "../models/Register.model";

// Extend the yup namespace with the custom method
declare module "yup" {
  interface StringSchema {
    verifyIdentification(customMessage?: string): this;
    uniqueKidIdentification(customMessage?: string): this;
    uniqueUserEmail(customMessage?: string): this;
    existUser(customMessage?: string): this;
    existKid(customMessage?: string): this;
    existService(customMessage?: string): this;
  }
  interface MixedSchema {
    uniqueKidIdentification(customMessage?: string): this;
  }
  interface NumberSchema {
    existUser(customMessage?: string): this;
    existKid(customMessage?: string): this;
    existService(customMessage?: string): this;
    sameKidAgain(customMessage?: string): this; // Valida si el mismo nino asiste al mismo dia en el mismo servicio
  }
}

/**
 * Todas las validaciones custom
 */
export function CustomValidations() {
  // Valida identifcacion
  Yup.addMethod<Yup.StringSchema>(
    Yup.string,
    "verifyIdentification",
    function (message) {
      return this.test(
        "verifyIdentification",
        message || invalidIdentification,
        function (valueParam) {
          const { path, createError } = this;

          const isValid = ValidateIdentification(valueParam as string);

          if (!isValid) createError({ path, message });
          return isValid;
        }
      );
    }
  );
  // Valida la identificacion de un nino en Kids
  Yup.addMethod<Yup.StringSchema>(
    Yup.string,
    "uniqueKidIdentification",
    function (message) {
      return this.test(
        "uniqueKidIdentification",
        message || existIdentification,
        async function (valueParam) {
          if (!valueParam) return true;

          const { path, createError, parent } = this;

          const idKid = parent.id;

          let exist = false;

          // On update
          if (idKid) {
            exist = await KidModel.validateIfKidExistForIdentification(
              valueParam as string,
              parseInt(idKid) as number
            );
          } else {
            // or save
            exist = await KidModel.validateIfKidExistForIdentification(
              valueParam as string
            );
          }

          if (exist) return createError({ path, message });

          return true;
        }
      );
    }
  );

  // Valida la identificacion de un nino en Kids
  Yup.addMethod<Yup.StringSchema>(
    Yup.string,
    "uniqueUserEmail",
    function (message) {
      return this.test(
        "uniqueUserEmail",
        message || existEmail,
        async function (valueParam) {
          if (!valueParam) return true;

          const { path, createError, parent } = this;

          const idKid = parent.id;

          let exist = false;

          // On update
          if (idKid) {
            exist = await UserModel.validateIfUserExistForEmail(
              valueParam as string,
              parseInt(idKid) as number
            );
          } else {
            // or save
            exist = await UserModel.validateIfUserExistForEmail(
              valueParam as string
            );
          }

          if (exist) return createError({ path, message });

          return true;
        }
      );
    }
  );

  //Valida si existe un usuario
  Yup.addMethod<Yup.NumberSchema>(Yup.number, "existUser", function (message) {
    return this.test(
      "existUser",
      message || notFound,
      async function (valueParam) {
        if (!valueParam) return true;

        const { path, createError, parent } = this;

        const userId = parent.register_user_id;

        const existUser = await UserModel.find(userId);

        if (!existUser) return createError({ path, message });

        return existUser;
      }
    );
  });

  //Valida si existe un usuario
  Yup.addMethod<Yup.NumberSchema>(Yup.number, "existUser", function (message) {
    return this.test(
      "existUser",
      message || notFound,
      async function (valueParam) {
        if (!valueParam) return true;

        const { path, createError, parent } = this;

        const userId = parent.register_user_id;

        const existUser = await UserModel.find(userId);

        if (!existUser) return createError({ path, message });

        return existUser;
      }
    );
  });

  //Valida si existe un Kid
  Yup.addMethod<Yup.NumberSchema>(Yup.number, "existKid", function (message) {
    return this.test(
      "existKid",
      message || notFound,
      async function (valueParam) {
        if (!valueParam) return true;

        const { path, createError, parent } = this;

        const kidId = parent.kid_id;

        const existKid = await KidModel.find(kidId);

        if (!existKid) return createError({ path, message });

        return existKid;
      }
    );
  });
  //Valida si existe un Kid
  Yup.addMethod<Yup.StringSchema>(Yup.string, "existKid", function (message) {
    return this.test(
      "existKid",
      message || notFound,
      async function (valueParam) {
        if (!valueParam) return true;

        const { path, createError, parent } = this;

        const kidId = parent.kid_id;

        const existKid = await KidModel.find(kidId);

        if (!existKid) return createError({ path, message });

        return existKid;
      }
    );
  });
  //Valida si existe un Service
  Yup.addMethod<Yup.StringSchema>(
    Yup.string,
    "existService",
    function (message) {
      return this.test(
        "existService",
        message || notFound,
        async function (valueParam) {
          if (!valueParam) return true;

          const { path, createError, parent } = this;

          const service_id = parent.service_id;

          const existService = await CampusServicesModel.find(service_id);

          if (!existService) return createError({ path, message });

          return existService;
        }
      );
    }
  );
  //Valida si existe un Service
  Yup.addMethod<Yup.NumberSchema>(
    Yup.number,
    "existService",
    function (message) {
      return this.test(
        "existService",
        message || notFound,
        async function (valueParam) {
          if (!valueParam) return true;

          const { path, createError, parent } = this;

          const service_id = parent.service_id;

          const existService = await CampusServicesModel.find(service_id);

          if (!existService) return createError({ path, message });

          return existService;
        }
      );
    }
  );
  
  
  //Valida si existe un Service
  Yup.addMethod<Yup.NumberSchema>(
    Yup.number,
    "sameKidAgain",
    function (message) {
      return this.test(
        "sameKidAgain",
        message || sameKidInSameDay,
        async function (valueParam) {
          if (!valueParam) return true;

          const { path, createError, parent } = this;

          const {kid_id, service_id} = parent;

          const existService = await RegisterModel.findRegisterSameDay(kid_id, service_id);
          if (existService) return createError({ path, message });
          // Por que no existe el muchacho
          return true;
        }
      );
    }
  );
}
