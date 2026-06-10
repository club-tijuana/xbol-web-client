export interface ShareTicket {
    ticketId: number,
    email: string;
    fullPhone: string;
    phone: string;
    phoneRegionCodeId?: number;
    applyToEntireSeason: boolean;
}