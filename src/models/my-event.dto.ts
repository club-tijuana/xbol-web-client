export interface MyEventDTO {
    orderId: number;
    eventId: number;
    eventImage: string;
    name: string;
    startDate: Date;
    location: string;
    isSeasonPass: boolean;
    isPastEvent: boolean;
    canRenovateSeasonPass: boolean;
    canViewTickets: boolean;
}
