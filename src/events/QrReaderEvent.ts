import { Socket } from "socket.io"
import { EVENTS_NAME } from "../constants"
import KidModel from "../models/Kid.model"
export const QrReaderEvent = (socket: Socket) => {
    socket.on(`${EVENTS_NAME.QR_READ}`, async (qr: string) => {
        if (!qr) return;
        const existKid = await KidModel.findByQr(qr)
        // EXISTE NIñO?
        if (existKid) {
            socket.emit(EVENTS_NAME.QR_EXIST_KID, { ...existKid })
        } else {
            socket.emit(EVENTS_NAME.QR_NOT_EXIST_KID, false)
        }

    })

    socket.on('disconnect', () => console.log('disconnect'))
}