import { Request, Response } from "express";
import RootControllerInterface from "../interfaces/RootControllerInterface.interface";
import CampusServices from "../models/CampusServices.model";

import {
  RESPONSES_TYPES,
  getErrorsByKeyForm,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
  parentModelNotFound,
} from "../utils";
import { CampusServicesRequest } from "../requests";
import { ValidationError } from "yup";
import Campus from "../models/Campus.model";

class CampusServicesController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const { campusId } = req.params;

    const campus = await Campus.find(parseInt(campusId) as number);
    // if doesn't exist
    if (!campus)
      return res
        .status(RESPONSES_TYPES.MODEL_NOT_FOUND)
        .json(parentModelNotFound);

    const users = await CampusServices.listAll(parseInt(campusId) as number);
    return res.status(RESPONSES_TYPES.SUCCESS).json(users);
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  async get(req: Request, res: Response) {
    const { campusId, id } = req.params;

    const campus = await Campus.find(parseInt(campusId) as number);
    // if doesn't exist
    if (!campus)
      return res
        .status(RESPONSES_TYPES.MODEL_NOT_FOUND)
        .json(parentModelNotFound);

    const user = await CampusServices.find(parseInt(id) as number);
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
    const { campusId } = req.params;

    const { body } = req;

    
    try {
      const campus = await Campus.find(parseInt(campusId) as number);
      // if doesn't exist
      if (!campus)
        return res
          .status(RESPONSES_TYPES.MODEL_NOT_FOUND)
          .json(parentModelNotFound);

      // insert campusId to body
      body.campus_id = parseInt(campusId);
      await CampusServicesRequest.validate(body, { abortEarly: false });

      const user = await CampusServices.save(body);
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

      console.error(error)

      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json(error);
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
    const { campusId, id } = req.params;

    try {
      const campus = await Campus.find(parseInt(campusId) as number);
      // if doesn't exist
      if (!campus)
        return res
          .status(RESPONSES_TYPES.MODEL_NOT_FOUND)
          .json(parentModelNotFound);

      // insert campusId to body
      body.campus_id = parseInt(campusId);
      await CampusServicesRequest.validate(body, { abortEarly: false });
      const user = await CampusServices.find(parseInt(id) as number);
      if (!user) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      const userUpdated = await CampusServices.update(
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
    const { campusId, id } = req.params;

    const campus = await Campus.find(parseInt(campusId) as number);
    // if doesn't exist
    if (!campus)
      return res
        .status(RESPONSES_TYPES.MODEL_NOT_FOUND)
        .json(parentModelNotFound);

    const user = await CampusServices.find(parseInt(id) as number);
    if (!user) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const deletedModel = await CampusServices.delete(parseInt(id) as number);

    if (deletedModel) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    }
  }
}

export default new CampusServicesController();
