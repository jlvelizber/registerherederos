import * as Yup from "yup";
import {
  ValidateIdentification,
  existIdentification,
  invalidIdentification,
} from "../utils";
import { PrismaClient } from "@prisma/client";
import KidModel from "../models/Kid.model";

const prisma = new PrismaClient();

// Extend the yup namespace with the custom method
declare module "yup" {
  interface StringSchema {
    verifyIdentification(customMessage?: string): this;
    uniqueKidIdentification(customMessage?: string): this;
  }
  interface MixedSchema {
    uniqueKidIdentification(customMessage?: string): this;
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

  Yup.addMethod<Yup.StringSchema>(
    Yup.string,
    "uniqueKidIdentification",
    function (message) {
      return this.test(
        "uniqueKidIdentification",
        message || existIdentification,
        async function (valueParam) {
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
}
