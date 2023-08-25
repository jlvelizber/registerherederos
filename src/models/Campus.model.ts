import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

const prisma = new PrismaClient();

class Campus implements RootModelInterface {
  private visibleColumns = {
    id: true,
    name: true,
    code_name: true,
    address: true,
    created_at: true,
    updated_at: true,
    deleted_at: false,
  };

  /**
   *
   * @returns Promise get All Users
   */
  async listAll(): Promise<any[]> {
    const campus = await prisma.campus.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    return campus;
  }

  /**
   *
   * @param id
   * @returns
   */
  async find(id: number): Promise<any> {
    return await prisma.campus.findFirst({
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
    return await prisma.campus.create({
      data: { ...body },
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.campus.update({
      where: { id: id },
      data: { ...data },
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number): Promise<any> {
    return await prisma.campus.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }
}

export default new Campus();
