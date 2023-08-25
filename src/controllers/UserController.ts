import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";
import UserModel from "../models/User.model";

import {
  RESPONSES_TYPES,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";

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
    const user = await UserModel.save(body);
    if (user) {
      return res.status(RESPONSES_TYPES.CREATED).json(user);
    }

    return res
      .status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR)
      .json(modelSaveError);
  }

  async update(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    const user = await UserModel.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const userUpdated = await UserModel.update(parseInt(id) as number, body);
    if (userUpdated) {
      return res.status(RESPONSES_TYPES.CREATED).json(userUpdated);
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