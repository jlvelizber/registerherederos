import { ValidationError } from "yup";

export enum RESPONSES_TYPES {
  MODEL_NOT_FOUND = 404,
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

export const getErrorsByKeyForm = (
  error: ValidationError
): Record<string, string> => {
  const errorsByKey: Record<string, string> = {};

  if (error.inner) {
    error.inner.forEach(
      (error) => (errorsByKey[error.path as string] = error.message)
    );
  }

  return errorsByKey;
};
