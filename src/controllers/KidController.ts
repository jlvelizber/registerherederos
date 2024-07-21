import { Request, Response } from "express";
import {RootControllerInterface} from "../interfaces";
import KidModel from "../models/Kid.model";

import {
  RESPONSES_TYPES,
  generateQR,
  generateTokenForQrKids,
  getErrorsByKeyForm,
  modelDeletedSuccessfully,
  modelNotFound,
} from "../utils";
import { KidRequestSchemaOnSave, KidRequestSchemaOnUpdate } from "../requests";
import { ValidationError } from "yup";
import { Kid } from "@prisma/client";

class KidController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const users = await KidModel.listAll();

    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      element['qr'] = element?.qr && await generateQR(element?.qr)

    }

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

      const user: Kid = await KidModel.save(body);

      /**
       * GENERACION DE QR INICIAL
       */
      user.qr = await generateTokenForQrKids(user);
      await KidModel.update(user.id, user);

      const qrForKids: any = await generateQR(user.qr);
      const userWithQr: Kid = { ...user, qr: qrForKids }

      if (user && userWithQr) {
        return res.status(RESPONSES_TYPES.CREATED).json(userWithQr);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(error);

        return res.status(RESPONSES_TYPES.BAD_REQUEST).json({ ...responseError });
      }

      console.log({ error });

      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  async update(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    try {
      // validamos si existe el modelo
      const kid = await KidModel.find(parseInt(id) as number);
      if (!kid) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      // valida
      // body.id = id;
      await KidRequestSchemaOnUpdate.validate(body, { abortEarly: false });

      // elimina id
      delete body.id;
      const kidUpdated = await KidModel.update(parseInt(id) as number, body);
      if (kidUpdated) {
        return res.status(RESPONSES_TYPES.CREATED).json(kidUpdated);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        // Extrae y formatea los errores que vienen desde yup
        const responseError = getErrorsByKeyForm(error);

        return res
          .status(RESPONSES_TYPES.BAD_REQUEST)
          .json({ ...responseError });
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
