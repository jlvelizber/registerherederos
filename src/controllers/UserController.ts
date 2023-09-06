import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";
import UserModel from "../models/User.model";

import {
  RESPONSES_TYPES,
  getErrorsByKeyForm,
  hashPassword,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";
import { ValidationError } from "yup";
import { UserRequestSchemaOnSave } from "../validations/UserRequest";

class UserController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const users = await UserModel.listAll();
    return res.status(RESPONSES_TYPES.SUCCESS).json(users);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserModel.find(parseInt(id) as number);
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

    const { password } = body;

    try {
      await UserRequestSchemaOnSave.validate(body, { abortEarly: false });

      /**
       * Hash password and send payload
       */
      const newPassword = await hashPassword(password);
      const newBody = { ...body, password: newPassword };

      const user = await UserModel.save(newBody);

      if (user) {
        return res.status(RESPONSES_TYPES.CREATED).json(user);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(err);

        return res
          .status(RESPONSES_TYPES.BAD_REQUEST)
          .json({ data: responseError });
      }
      return res
        .status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR)
        .json(modelSaveError);
    }
  }

  async update(req: Request, res: Response) {
    const { body } = req;
    const { password } = body;
    const { id } = req.params;

    try {
      body.id = id;

      await UserRequestSchemaOnSave.validate(body, { abortEarly: false });

      const user = await UserModel.find(parseInt(id) as number);
      if (!user) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

       /**
       * Hash password and send payload
       */
       const newPassword = await hashPassword(password);
       // elimina id
       delete body.id;
       const newBody = { ...body, password: newPassword };
      const userUpdated = await UserModel.update(parseInt(id) as number, newBody);
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

      console.log(error);
      return res
        .status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR)
        .json(modelSaveError);
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

    const user = await UserModel.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const deletedModel = await UserModel.delete(parseInt(id) as number);

    if (deletedModel) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    }
  }
}

export default new UserController();
