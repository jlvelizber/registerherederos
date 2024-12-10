import { Request, Response } from "express";
import { RootControllerInterface } from "../interfaces";
import KidModel from "../models/Kid.model";
import { Kid } from "@prisma/client";
import { ValidationError } from "yup";
import { KidRequestSchemaOnSave, KidRequestSchemaOnUpdate } from "../requests";
import {
  RESPONSES_TYPES,
  generateQR,
  generateTokenForQrKids,
  getErrorsByKeyForm,
  modelDeletedSuccessfully,
  modelNotFound,
} from "../utils";

class KidController implements RootControllerInterface {
  /**
   * Listar todos los niños
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    try {
      const users = await KidModel.listAll();

      for (let index = 0; index < users.length; index++) {
        const element = users[index];
        element["qr"] = element?.qr && (await generateQR(element?.qr));
      }

      return res.status(RESPONSES_TYPES.SUCCESS).json(users);
    } catch (error) {
      console.error("Error al listar los niños:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error al listar los niños" });
    }
  }

  /**
   * Obtener un niño por su ID
   * @param req
   * @param res
   * @returns
   */
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await KidModel.find(parseInt(id));

      if (user) {
        return res.status(RESPONSES_TYPES.SUCCESS).json(user);
      }

      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    } catch (error) {
      console.error("Error al obtener el niño:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error al obtener el niño" });
    }
  }

  /**
   * Guardar un nuevo niño
   * @param req
   * @param res
   * @returns
   */
  async save(req: Request, res: Response) {
    const { body } = req;
    try {
      // Validar el cuerpo de la solicitud
      await KidRequestSchemaOnSave.validate(body, { abortEarly: false });

      const user: Kid = await KidModel.save(body);

      // Generar el QR inicial
      user.qr = await generateTokenForQrKids(user);
      await KidModel.update(user.id, user);

      const qrForKids = await generateQR(user.qr);
      const userWithQr: Kid = { ...user, qr: qrForKids.toString() };

      return res.status(RESPONSES_TYPES.CREATED).json(userWithQr);
    } catch (error) {
      if (error instanceof ValidationError) {
        const responseError = getErrorsByKeyForm(error);
        return res.status(RESPONSES_TYPES.BAD_REQUEST).json(responseError);
      }

      console.error("Error al guardar el niño:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error al guardar el niño" });
    }
  }

  /**
   * Actualizar un niño por su ID
   * @param req
   * @param res
   */
  async update(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    try {
      const kid = await KidModel.find(parseInt(id));

      if (!kid) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      // Validar el cuerpo de la solicitud
      await KidRequestSchemaOnUpdate.validate(body, { abortEarly: false });

      // Eliminar el campo 'id' del cuerpo antes de actualizar
      delete body.id;
      const kidUpdated = await KidModel.update(parseInt(id), body);

      return res.status(RESPONSES_TYPES.SUCCESS).json(kidUpdated);
    } catch (error) {
      if (error instanceof ValidationError) {
        const responseError = getErrorsByKeyForm(error);
        return res.status(RESPONSES_TYPES.BAD_REQUEST).json(responseError);
      }

      console.error("Error al actualizar el niño:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error al actualizar el niño" });
    }
  }

  /**
   * Eliminar un niño por su ID (soft delete)
   * @param req
   * @param res
   * @returns
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await KidModel.find(parseInt(id));
      if (!user) {
        return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
      }

      await KidModel.delete(parseInt(id));
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    } catch (error) {
      console.error("Error al eliminar el niño:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error al eliminar el niño" });
    }
  }

  /**
   * Buscar niños por una consulta
   * @param req
   * @param res
   * @returns
   */
  async queryKids(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (query?.length) {
        const results = await KidModel.queryKids(query as string);
        return res.status(RESPONSES_TYPES.SUCCESS).json(results);
      }

      return res.status(RESPONSES_TYPES.BAD_REQUEST).json({ error: "Consulta no válida" });
    } catch (error) {
      console.error("Error en la consulta de niños:", error);
      return res.status(RESPONSES_TYPES.INTERNAL_SERVER_ERROR).json({ error: "Error en la consulta de niños" });
    }
  }

  /**
   * Exporta un reporte en Excel filtrado por campus.
   * @param campusId - ID del campus a filtrar.
   * @param res - Objeto Response de Express.
   */
  async exportKidsByCampus(req: Request, res: Response) {
    const { campusId } = req.params;
    await KidModel.exportXlSQueryList(Number(campusId), res);
  }

}

export default new KidController();
