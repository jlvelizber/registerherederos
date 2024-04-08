import { Kid } from "@prisma/client";

export interface QrKidInterface extends Kid {
    qr?: string
}