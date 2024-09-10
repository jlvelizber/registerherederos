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
  async listAll(params: any): Promise<any[]> {
    const registers = await prisma.register.findMany({
      where: {
        service_id: parseInt(params.serviceId) as number,
        deleted_at: null,
        created_at: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate),
        },
      },
      select: {
        kid: true,
      },
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
    return await prisma.register.create({
      data: { ...body },
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
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async findRegisterSameDay(kidId: number, serviceId: number): Promise<any> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const register = await prisma.register.findFirst({
      where: {
        AND: [
          {
            kid_id: kidId,
            service_id: serviceId,
            created_at: {
              gte: currentDate,
            },
          },
          {
            deleted_at: {
              equals: null,
            },
          },
        ],
      },
    });
    // console.log(register);
    return register;
  }
}

export default new Register();
