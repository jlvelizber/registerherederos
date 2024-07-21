import { Request, Response } from "express";
import excelJs from "exceljs";
import {RootControllerInterface} from "../interfaces";
import {
  RESPONSES_TYPES,
  formatDate,
  getErrorsByKeyForm,
  getYearOld,
  modelDeletedSuccessfully,
  modelNotFound,
  modelSaveError,
} from "../utils";
import { RegisterRequest } from "../requests";
import { ValidationError } from "yup";

import RegisterModel from "../models/Register.model";

class RegisterController implements RootControllerInterface {
  /**
   *
   * @param req
   * @param res
   */
  async list(req: Request, res: Response) {
    const { query } = req;

    let serviceId = "1";

    if (Object.prototype.hasOwnProperty.call(query, "service_id")) {
      serviceId = query.service_id as string;
    }

    const startDate = formatDate() + " 00:00:00";
    const endDate = formatDate() + " 23:59:59";

    const registers = await RegisterModel.listAll({
      serviceId,
      startDate,
      endDate,
    });

    const kidRegisters: any = [];
    if (registers.length > 0) {
      registers.forEach((reg) => kidRegisters.push(reg.kid));
    }

    return res.status(RESPONSES_TYPES.SUCCESS).json(kidRegisters);
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
    const { body, headers } = req;

    try {
      await RegisterRequest.validate(body, { abortEarly: false });

      const register = await RegisterModel.save(body);

      if (register) {
        return res.status(RESPONSES_TYPES.CREATED).json(register);
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

      console.log(error);

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
    const {
      params: { id },
      body: { service_id },
    } = req;

    const register = await RegisterModel.findRegisterSameDay(
      parseInt(id) as number,
      service_id
    );
    if (!register) {
      return res.status(RESPONSES_TYPES.MODEL_NOT_FOUND).json(modelNotFound);
    }

    const deletedModel = await RegisterModel.delete(register.id);

    if (deletedModel) {
      return res.status(RESPONSES_TYPES.SUCCESS).json(modelDeletedSuccessfully);
    }
  }

  async queryReporter(req: Request, res: Response) {
    const {
      query: { service_id: serviceId, date },
    } = req;

    const startDate = date + " 00:00:00";
    const endDate = date + " 23:59:59";

    const registers = await RegisterModel.listAll({
      serviceId,
      startDate,
      endDate,
    });

    const kidRegisters: any = [];
    if (registers.length > 0) {
      registers.forEach((reg) => kidRegisters.push(reg.kid));
    }

    return res.status(RESPONSES_TYPES.SUCCESS).json(kidRegisters);
  }

  async exportXlSQueryReporter(req: Request, res: Response) {
    const { serviceId, dateString } = req.body;

    const startDate = dateString + " 00:00:00";
    const endDate = dateString + " 23:59:59";

    const registers = await RegisterModel.listAll({
      serviceId,
      startDate,
      endDate,
    });

    const workBook = new excelJs.Workbook();

    const workSheet = workBook.addWorksheet("Niños");

    workSheet.columns = [
      { header: "Identificación del niño", key: "identification" },
      { header: "Nombre", key: "name" },
      { header: "Apellidos", key: "lastname" },
      { header: "Edad", key: "date_born" },
      { header: "Contacto", key: "parent_phone" },
    ];

    registers.forEach((reg) => {
      workSheet.addRow({
        ...reg.kid,
        date_born: `${getYearOld(reg.kid.date_born)} año(s)`,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "users.xlsx"
    );

    // Write the workbook to the response object
    workBook.xlsx.write(res).then(() => res.end());
  }
}

export default new RegisterController();
