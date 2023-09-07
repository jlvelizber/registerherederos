import { PrismaClient } from "@prisma/client";

export default interface RootModelInterface 
{
    listAll?(parentId?: number): Promise<PrismaClient[]>;
    save?(body : any): Promise<PrismaClient>;
    find?(id: number): Promise<PrismaClient>;
    update?(id: number, data: any): Promise<PrismaClient>;
    delete?(id: number):  Promise<PrismaClient>;
}