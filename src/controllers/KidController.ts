import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";
import KidModel from "../models/Kid.model";

import {
  RESPONSES_TYPES,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";

class KidController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const users = await KidModel.listAll();
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
    const user = await KidModel.find(parseInt(id) as number);
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
    const user = await KidModel.save(body);
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

    const user = await KidModel.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const userUpdated = await KidModel.update(parseInt(id) as number, body);
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

    const user = await KidModel.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const deletedModel = await KidModel.delete(parseInt(id) as number);

    if (deletedModel) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    }
  }
}


export default new KidController()