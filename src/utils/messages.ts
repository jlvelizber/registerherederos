import { MessageResponse } from "../interfaces";

export const modelNotFound : MessageResponse = {
    ok: false,
    message: 'Model not found'
}

export const modelSaveError : MessageResponse = {
    ok : false,
    message : 'Model save error'
}

export const modelDeletedSuccessfully : MessageResponse = {
    ok : true,
    message : 'Model Deleted Successfully'
}