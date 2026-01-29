import ticketsMock from "@/data/my-tickets.mock.json";
import { MyTicketDto } from "@/models/my-ticket.dto";

export function getMyTickets(): MyTicketDto[] | null {
    const tickets = ticketsMock.filter(t => t.type === 1);
    return tickets;
}

export function getMySeasonTickets() {
    const tickets = ticketsMock.filter(t => t.type === 2);
    return tickets;
}