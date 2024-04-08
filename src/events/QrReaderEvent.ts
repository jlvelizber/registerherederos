import { Socket } from "socket.io"
import { EVENTS_NAME } from "../constants"
export const QrReaderEvent = (socket: Socket) => {
    socket.on(`${EVENTS_NAME.QR_READ}`, (message: any) => {
        console.info('entro al evento', message)
    })

    socket.on('disconnect', () => console.log('disconnect'))
}