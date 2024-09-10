import { Prisma, PrismaClient } from "@prisma/client";
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

    // Formatea la fecha de nacimiento del niño
    const kidsFormatteds = kids.map((kid) => {
      return {
        ...kid,
        date_born: kid.date_born?.toISOString().split('T')[0]
      };
    });

    return kidsFormatteds;
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

      const kidWasDeleted = await this.getKidDeletedByIdentification(body.identification);

      if (!kidWasDeleted) {
        const kid = await prisma.kid.create({
          data: { ...body, date_born: new Date(body.date_born) },
        });
        return kid;
      }

      const newBody = { ...kidWasDeleted, ...body, deleted_at: null }; // restaurar ni
      const kid: Kid = await this.update(kidWasDeleted.id, newBody);




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
   * Busca un nino por identificacion tomando en cuenta si no ha sido eliminado
   */

  async validateIfKidExistForIdentification(
    identification: string,
    idKid?: number
  ): Promise<boolean> {
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

    if (kid && kid.identification) return true;
    return false;
  }
  /**
   * 
   * @param query Busca el nino por algunas cosas
   * @returns 
   */
  async queryKids(query: string) {

    const queryLike = `%${query.split(" ").join("%")}%`;
    const {deleted_at, ...rest} = this.visibleColumns;
    const copyColumns = {...rest};
    
    const selectColumns = Object.keys(copyColumns).join(', ');
    const result = await prisma.$queryRaw(Prisma.sql`SELECT 
      ${Prisma.sql([selectColumns])} 
    FROM Kid where 
    concat (name,' ',lastname) like ${queryLike} 
    or identification like ${queryLike}  
    or parent_lastname like ${queryLike}
    and deleted_at is null;`)

    return result;
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


  /**
   * Get a Kid deleted
   * @param identification 
   * @returns 
   */
  async getKidDeletedByIdentification(identification: string) {
    return await prisma.kid.findFirst({
      where: {
        NOT: {
          deleted_at: null
        },
        identification: identification
      }
    })
  }
}

export default new Kid();
