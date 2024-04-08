import { Kid } from "@prisma/client";
import { hashPassword } from "./passwords"
import Qr from 'qr-image';

export const generateQRForKids = async (kid: Kid) => {
    const  { id, name, lastname } = kid
    const dataForEncription = id +'_' + name + '_' + lastname
    const encrypted = await hashPassword(dataForEncription)
    return generateQR(encrypted)

}


export const generateQR = async (data: string) => {

    return  Qr.imageSync( data, {
        type: 'svg',

    } )

}