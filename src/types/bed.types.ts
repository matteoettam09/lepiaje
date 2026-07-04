export type OccupantSource =
    | "internal"
    | "admin"
    | "airbnb"
    | "booking";

export interface Occupant {
    name: string;
    check_in: Date;
    check_out: Date;
    gender: string;
    source?: OccupantSource;
    externalUid?: string;
}

export type BedType = {
    uuid: string;
    room_gender: string;
    occupants: Occupant[];
    submittedAt: Date;
};

export type Bed = {
    _id: string;
    uuid: string;
    is_occupied: boolean;
    occupants: Occupant[];
    submittedAt: Date;
    room_gender: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
};

type Room = {
    name: string;
    gender: "male" | "female";
    uuid: string;
    beds: Bed[];
};

export type AvailableBeds = Room[];
