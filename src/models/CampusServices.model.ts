import { PrismaClient } from "@prisma/client";
import RootModelInterface from "../interfaces/RootModelInterface.interface";

const prisma = new PrismaClient();

class CampusServices implements RootModelInterface {
  private visibleColumns = {
    id: true,
    campus_id: true,
    description: true,
    start_hour: true,
    end_hour: true,
    created_at: true,
    updated_at: true,
    deleted_at: false,
  };

  /**
   *
   * @returns Promise get All Users
   */
  async listAll(): Promise<any[]> {
    const services = await prisma.campusServices.findMany({
      where: {
        deleted_at: null,
      },
      select: this.visibleColumns,
    });

    return services;
  }

  /**
   *
   * @param id
   * @returns
   */
  async find(id: number): Promise<any> {
    return await prisma.campusServices.findFirst({
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
    return await prisma.campusServices.create({
      data: { ...body },
    });
  }

  /**
   *
   * @param id
   * @param data
   */
  async update(id: number, data: any): Promise<any> {
    return await prisma.campusServices.update({
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
    return await prisma.campusServices.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  }
}

export default new CampusServices();
