import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

const prisma = new PrismaClient();

class Kid implements RootModelInterface {
  private visibleColumns = {
    id: true,
    identification: true,
    name: true,
    lastname: true,
    email: true,
    parent_name: true,
    parent_lastname: true,
    parent_email: true,
    parent_phone: true,
    created_at: true,
    updated_at: true,
    deleted_at: false,
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
    return await prisma.kid.create({
      data: { ...body },
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.kid.update({
      where: { id },
      data: { ...data },
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
}

export default new Kid();
