import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

const prisma = new PrismaClient();

class User implements RootModelInterface {
  private visibleColumns = {
    id: true,
    name: true,
    email: true,
    role: true,
    created_at: true,
    updated_at: true,
    password: false,
    deleted_at: false,
  };

  /**
   *
   * @returns Promise get All Users
   */
  async listAll(): Promise<any[]> {
    const users = await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    return users;
  }

  /**
   *
   * @param id
   * @returns
   */
  async find(id: number): Promise<any> {
    return await prisma.user.findFirst({
      where: { deleted_at: null, id: id },
      select: this.visibleColumns,
    });
  }

  /**
   *
   * @param body
   * @returns
   */
  async save(body: any): Promise<any> {
    return await prisma.user.create({
      data: body,
      select: this.visibleColumns,
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.user.update({
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
    return await prisma.user.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Validate if an user exist by its email
   */

  async validateIfUserExistForEmail(
    email: string,
    idUser?: number
  ): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        id: {
          not: idUser,
        },
      },
      select: { email: true },
    });

    if (user && user.email) return true;
    return false;
  }
}

export default new User();
