"use client";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Slide, Stack, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";

import { MyEventDTO } from "@/models/my-event.dto";

import TicketCard from "../TicketCard/TicketCard";

interface CarouselTicketsProps {
    carouselKey: string;
    tickets?: MyEventDTO[] | null;
}

export default function CarouselTickets({ carouselKey, tickets }: CarouselTicketsProps) {
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const cardsPerPage = isXs ? 1 : isSm ? 2 : 3;

    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    const pages = useMemo(() => {
        if (!tickets) return [];
        return Array.from(
            { length: Math.ceil(tickets.length / cardsPerPage) },
            (_, i) =>
                tickets.slice(i * cardsPerPage, i * cardsPerPage + cardsPerPage)
        );
    }, [tickets, cardsPerPage]);

    const currentTickets = pages[currentPage] || [];

    const handleNextPage = () => {
        setSlideDirection("left");
        setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
    };

    const handlePrevPage = () => {
        setSlideDirection("right");
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", height: 400 }}>
            <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                sx={{ display: pages.length > 1 ? "block" : "none" }}
            >
                <ArrowBackIos sx={{ fontSize: 40 }} />
            </IconButton>

            <Box sx={{ width: "100%", overflow: "hidden" }}>
                <Slide
                    key={currentPage}
                    direction={slideDirection}
                    in
                    mountOnEnter
                    unmountOnExit
                >
                    <Stack direction="row" spacing={2} justifyContent="center">
                        {currentTickets.map((ticket) => (
                            <Box
                                key={`${carouselKey}-${ticket.orderId}-${ticket.eventId}`}
                                sx={{ width: `${100 / cardsPerPage}%` }}
                            >
                                <TicketCard ticket={ticket} />
                            </Box>
                        ))}
                    </Stack>
                </Slide>
            </Box>

            <IconButton
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                sx={{ display: pages.length > 1 ? "block" : "none" }}
            >
                <ArrowForwardIos sx={{ fontSize: 40 }} />
            </IconButton>
        </Box>
    );
}
