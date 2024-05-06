import { Kid } from "@prisma/client";
import KidModel from "../models/Kid.model"
import { generateTokenForQrKids } from "../utils";

class QRGenerator {

    static async GenerateQRJob() {
        const kids = await KidModel.getAllKidsWithoutQr();

        for (let index = 0; index < kids.length; index++) {
            const element = kids[index];
            
            element.qr = await generateTokenForQrKids(element as Kid);
            await KidModel.update(element.id, element);

        }
    }
}



QRGenerator.GenerateQRJob();