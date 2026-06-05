export enum TicketType {
    Adult,
    Child,
    Courtesy
}

export const TicketTypeLabels: Record<TicketType, string> = {
    [TicketType.Adult]: "Adulto",
    [TicketType.Child]: "Niño",
    [TicketType.Courtesy]: "Cortesía"
};