import { Request, Response } from "express";

export interface RootControllerInterface
{
    list?(req: Request, res : Response) : void
    get?(req: Request, res: Response): void
    save?(req: Request, res: Response) : void
    update?(req: Request, res: Response) : void
    delete?(req: Request, res: Response): void
}