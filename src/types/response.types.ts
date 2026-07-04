import { Property } from "./property.types";

export interface HttpResponseType {
    status: number,
    error: boolean,
    errorDetails: string | null,
    message: unknown
}

export interface ClientResponseType {
    error: boolean,
    message: string | Property
}


