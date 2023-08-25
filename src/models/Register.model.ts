import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

const prisma = new PrismaClient();

class Register implements RootModelInterface {
  private visibleColumns = {
    id: true,
    register_user_id: true,
    kid_id: true,
    service_id: true,
    created_at: true,
    updated_at: true,
    deleted_at: false,
  };

  /**
   *
   * @returns Promise get All Registers
   */
  async listAll(): Promise<any[]> {
    const registers = await prisma.register.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    return registers;
  }

  /**
   *
   * @param id
   * @returns
   */
  async find(id: number): Promise<any> {
    return await prisma.register.findFirst({
      where: { deleted_at: null,  id },
      select: this.visibleColumns,
    });
  }

  /**
   *
   * @param body
   * @returns
   */
  async save(body: any): Promise<any> {
    return await prisma.register.create({
      data: {...body},
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.register.update({
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
    return await prisma.register.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }
}

export default new Register();
