import Qr from 'qr-image';


export const generateQR = async (data: string) => {

    return  Qr.imageSync( data, {
        type: 'svg',

    } )

}