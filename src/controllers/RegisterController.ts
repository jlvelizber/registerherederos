import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";

import {
  RESPONSES_TYPES,
  getErrorsByKeyForm,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";
import { RegisterRequest } from "../validations";
import { ValidationError } from "yup";
import RegisterModel from "../models/Register.model";

class RegisterController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const registers = await RegisterModel.listAll();
    return res.status(RESPONSES_TYPES.SUCCESS).json(registers);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const user = await RegisterModel.find(parseInt(id) as number);
    if (user) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(user);
    }

    return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async save(req: Request, res: Response) {
    const { body } = req;

    try {
      await RegisterRequest.validate(body, { abortEarly: false });

      const user = await RegisterModel.save(body);
      if (user) {
        return res.status(RESPONSES_TYPES.CREATED).json(user);
      }

      return res
        .status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR)
        .json(modelSaveError);
    } catch (error) {
      if (error instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(error);

        return res
          .status(RESPONSES_TYPES.BAD_REQUEST)
          .json({ data: responseError });
      }

      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  /**
   * Update the model
   * @param req U
   * @param res
   * @returns
   */

  async update(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    try {
      await RegisterRequest.validate(body, { abortEarly: false });
      const user = await RegisterModel.find(parseInt(id) as number);
      if (!user) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      const userUpdated = await RegisterModel.update(
        parseInt(id) as number,
        body
      );
      if (userUpdated) {
        return res.status(RESPONSES_TYPES.CREATED).json(userUpdated);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(error);

        return res
          .status(RESPONSES_TYPES.BAD_REQUEST)
          .json({ data: responseError });
      }

      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const user = await RegisterModel.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const deletedModel = await RegisterModel.delete(parseInt(id) as number);

    if (deletedModel) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    }
  }
}

export default new RegisterController();
