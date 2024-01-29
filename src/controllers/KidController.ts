import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";
import KidModel from "../models/Kid.model";

import {
  RESPONSES_TYPES,
  getErrorsByKeyForm,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";
import { KidRequestSchemaOnSave } from "../requests";
import { ValidationError } from "yup";

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
    try {
      // valida
      await KidRequestSchemaOnSave.validate(body, { abortEarly: false });
      
      const user = await KidModel.save(body);
      if (user) {
        return res.status(RESPONSES_TYPES.CREATED).json(user);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(error);

        return res
          .status(RESPONSES_TYPES.BAD_REQUEST)
          .json({ data: responseError });
      }

      console.log({error})

      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json( error );
    }
  }

  async update(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    try {
      // validamos si existe el modelo
      const user = await KidModel.find(parseInt(id) as number);
      if (!user) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      // valida
      body.id = id;
      await KidRequestSchemaOnSave.validate(body, { abortEarly: false });

      // elimina id
      delete body.id;
      const userUpdated = await KidModel.update(parseInt(id) as number, body);
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

  async queryKids(req: Request, res: Response) {
    const {
      query: { query },
    } = req;

    if (query?.length) {
      const results = await KidModel.queryKids(query as string);
      return res.status(RESPONSES_TYPES.SUCCESS).json(results);
    }
  }
}

export default new KidController();
