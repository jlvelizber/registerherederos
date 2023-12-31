import { MessageResponse } from "../interfaces";

export const modelNotFound : MessageResponse = {
    ok: false,
    message: 'Model not found'
}

export const parentModelNotFound : MessageResponse = {
    ok: false,
    message: 'Parent model not found'
}

export const modelSaveError : MessageResponse = {
    ok : false,
    message : 'Model save error'
}

export const modelDeletedSuccessfully : MessageResponse = {
    ok : true,
    message : 'Model Deleted Successfully'
}

export const invalidIdentification = "invalid identification";

export const existIdentification = "identification now exists";

export const existEmail = "Email now exists";


export const notFound = "not found";

export const sameKidInSameDay = "same kid in same day";