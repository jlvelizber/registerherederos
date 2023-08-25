import * as Yup from "yup";
import { ValidateIdentification, invalidIdentification } from "../utils";

// Extend the yup namespace with the custom method
declare module "yup" {
  interface StringSchema {
    verifyIdentification(customMessage?: string): this;
  }
}

/**
 * Todas las validaciones custom
 */
export function CustomValidations() {
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
        }
      );
    }
  );
}
