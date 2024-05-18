import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

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
    address: true
  };

  /**
   *
   * @returns Promise get All kids
   */
  async listAll(): Promise<any[]> {
    const kids = await prisma.kid.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    return kids;
  }

  /**
   *
   * @param id
   * @returns
   */
  async find(id: number): Promise<any> {
    return await prisma.kid.findFirst({
      where: { deleted_at: null, id },
      select: this.visibleColumns,
    });
  }

  /**
   *
   * @param body
   * @returns
   */
  async save(body: any): Promise<any> {
    try {
      const kid = await prisma.kid.create({
        data: { ...body, date_born: new Date(body.date_born) },
      });
      return kid;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.kid.update({
      where: { id },
      data: { ...data, date_born: new Date(data.date_born) },
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number): Promise<any> {
    return await prisma.kid.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Busca un nino por identificacion
   */

  async validateIfKidExistForIdentification(
    identification: string,
    idKid?: number
  ): Promise<boolean> {
    const kid = await prisma.kid.findFirst({
      where: {
        identification: identification,
        id: {
          not: idKid,
        },
      },
      select: { identification: true },
    });

    if (kid && kid.identification) return true;
    return false;
  }
  /**
   * 
   * @param query Busca el nino por algunas cosas
   * @returns 
   */
  async queryKids(query: string) {
    const kids = await prisma.kid.findMany({
      where: {
        OR: [
          {
            identification: {
              contains: `${query}`,
            },
          },
          {
            name: {
              contains: `${query}`,
            },
          },
          {
            lastname: {
              contains: `${query}`,
            },
          },
          {
            parent_name: {
              contains: `${query}`,
            },
          },
        ],
      },
    });
    return kids;
  }

  /**
   * 
   */
  async findByQr(qrstring: string) {
    return await prisma.kid.findFirst({
      where: { deleted_at: null, qr: qrstring },
      select: { ...this.visibleColumns },
    });
  }


  async getAllKidsWithoutQr() {
    const kids = await prisma.kid.findMany({
      where: {
        deleted_at: null,
        qr: null
      },
      select: this.visibleColumns,
    });

    return kids;
  }
}

export default new Kid();
