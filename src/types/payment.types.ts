export interface Payment {
    bookerEmail: string;
    bookingUuid?: string;
    amount: number;
    paymentMethod?: string;
    paymentDate?: Date;
    status: string;
    transactionId?: string;
    additionalDetails?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
