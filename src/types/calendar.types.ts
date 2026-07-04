export type CalendarPlatform = "airbnb" | "booking";

export type OccupantSource = "internal" | "admin" | "airbnb" | "booking";

export interface ExternalCalendarEvent {
    uid: string;
    checkIn: Date;
    checkOut: Date;
}

export interface CalendarConnectionType {
    propertyId: number;
    platform: CalendarPlatform;
    importUrl: string;
    exportToken: string;
    enabled: boolean;
    lastImportAt?: Date;
    lastImportStatus?: "ok" | "error" | "skipped";
    lastImportError?: string;
}
