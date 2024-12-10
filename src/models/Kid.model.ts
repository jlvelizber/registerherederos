import { Prisma, PrismaClient } from "@prisma/client";
import { Response } from "express";
import ExcelJS from "exceljs";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

import {
  getYearOld,
} from "../utils";

const prisma = new PrismaClient();

class Kid implements RootModelInterface {
  private visibleColumns = {
    id: true,
    identification: true,
    name: true,
    lastname: true,
    date_born: true,
    parent_name: true,
    parent_lastname: true,
    qr: true,
    parent_email: true,
    parent_phone: true,
    created_at: true,
    updated_at: true,
    deleted_at: false,
    address: true,
    campus: true, // Asegúrate de incluir el campo 'campus'
  };

  /**
   * Obtener todos los niños sin eliminar
   * @returns Promise con la lista de niños
   */
  async listAll(): Promise<any[]> {
    const kids = await prisma.kid.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    // Formatea la fecha de nacimiento del niño
    const kidsFormatteds = kids.map((kid) => ({
      ...kid,
      date_born: kid.date_born?.toISOString().split("T")[0],
    }));

    return kidsFormatteds;
  }

  /**
   * Encontrar un niño por su ID
   * @param id
   * @returns Promise con el niño encontrado
   */
  async find(id: number): Promise<any> {
    return await prisma.kid.findFirst({
      where: { deleted_at: null, id },
      select: this.visibleColumns,
    });
  }

  /**
   * Guardar un nuevo niño o restaurar si fue eliminado
   * @param body
   * @returns Promise con el niño guardado
   */
  async save(body: any): Promise<any> {
    try {
      const kidWasDeleted = await this.getKidDeletedByIdentification(body.identification);

      if (!kidWasDeleted) {
        const kid = await prisma.kid.create({
          data: { ...body, date_born: new Date(body.date_born) },
        });
        return kid;
      }

      const newBody = { ...kidWasDeleted, ...body, deleted_at: null }; // Restaurar niño eliminado
      const kid: Kid = await this.update(kidWasDeleted.id, newBody);

      return kid;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   * Actualizar un niño por su ID
   * @param id
   * @param data
   * @returns Promise con el niño actualizado
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.kid.update({
      where: { id },
      data: { ...data, date_born: new Date(data.date_born) },
    });
  }

  /**
   * Eliminar un niño por su ID (soft delete)
   * @param id
   * @returns Promise con el niño eliminado
   */
  async delete(id: number): Promise<any> {
    return await prisma.kid.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Validar si un niño existe por su identificación
   * @param identification
   * @param idKid
   * @returns Promise con booleano
   */
  async validateIfKidExistForIdentification(identification: string, idKid?: number): Promise<boolean> {
    const kid = await prisma.kid.findFirst({
      where: {
        identification: identification,
        deleted_at: null,
        id: {
          not: idKid,
        },
      },
      select: { identification: true },
    });

    return !!kid;
  }

  /**
   * Buscar niños por una consulta
   * @param query
   * @returns Promise con la lista de niños que coinciden
   */
  async queryKids(query: string) {
    const queryLike = `%${query.split(" ").join("%")}%`;
    const { deleted_at, ...rest } = this.visibleColumns;
    const copyColumns = { ...rest };

    const selectColumns = Object.keys(copyColumns).join(", ");
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT ${Prisma.sql([selectColumns])} FROM Kid WHERE (concat(name, ' ', lastname) LIKE ${queryLike} OR identification LIKE ${queryLike} OR parent_lastname LIKE ${queryLike}) AND deleted_at IS NULL;`
    );

    return result;
  }

  /**
   * Encontrar un niño por su código QR
   * @param qrstring
   * @returns Promise con el niño encontrado
   */
  async findByQr(qrstring: string) {
    return await prisma.kid.findFirst({
      where: { deleted_at: null, qr: qrstring },
      select: this.visibleColumns,
    });
  }

  /**
   * Obtener todos los niños sin QR
   * @returns Promise con la lista de niños sin QR
   */
  async getAllKidsWithoutQr() {
    return await prisma.kid.findMany({
      where: {
        deleted_at: null,
        qr: null,
      },
      select: this.visibleColumns,
    });
  }

  /**
   * Obtener un niño eliminado por su identificación
   * @param identification
   * @returns Promise con el niño eliminado
   */
  async getKidDeletedByIdentification(identification: string) {
    return await prisma.kid.findFirst({
      where: {
        NOT: {
          deleted_at: null,
        },
        identification: identification,
      },
    });
  }

  /**
   * Exporta un reporte en Excel filtrado por campus.
   * @param campusId - ID del campus a filtrar.
   * @param res - Objeto Response de Express.
   */
  async exportXlSQueryList(campusId: number, res: Response) {
    try {
      const kids = await prisma.kid.findMany({
        where: { deleted_at: null, campus: campusId },
      });

      const workBook = new ExcelJS.Workbook();
      const workSheet = workBook.addWorksheet("Listado de Niños");

      workSheet.columns = [
        { header: "Identificación", key: "identification", width: 25 },
        { header: "Nombre", key: "name", width: 20 },
        { header: "Apellidos", key: "lastname", width: 20 },
        { header: "Edad", key: "date_born", width: 20 },
        { header: "Contacto", key: "parent_phone", width: 25 },
        { header: "Campus", key: "campus", width: 25 },
      ];

      // Iterar sobre los niños y agregar filas
      kids.forEach((kid) => {
        workSheet.addRow({
          identification: kid.identification,
          name: kid.name,
          lastname: kid.lastname,
          date_born: kid.date_born ? `${getYearOld(kid.date_born.toISOString())} año(s)` : "No registrada",
          parent_phone: kid.parent_phone,
          campus: kid.campus === 1 ? "Norte" : kid.campus === 2 ? "Sur" : "",
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=kids.xlsx");

      await workBook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al generar el reporte de Excel");
    }
  }
}

export default new Kid();
