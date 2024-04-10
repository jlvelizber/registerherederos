import { Socket } from "socket.io"
import { EVENTS_NAME } from "../constants"
import KidModel from "../models/Kid.model"
export const QrReaderEvent = (socket: Socket) => {
    socket.on(`${EVENTS_NAME.QR_READ}`, async (qr: string) => {
        if (!qr) return;
        const existKid = await KidModel.findByQr(qr)
        console.log('entra',existKid)
        //  $2a$10$wDg7TgNUfU34ix4.HdPJtuadaEgb8CEtjSASsYjo3qm7StzX1/9Bu
        if (existKid) {
            socket.emit(EVENTS_NAME.QR_EXIST_KID, { ...existKid })
        } else {
            socket.emit(EVENTS_NAME.QR_NOT_EXIST_KID, false)
        }

    })

    socket.on('disconnect', () => console.log('disconnect'))
}