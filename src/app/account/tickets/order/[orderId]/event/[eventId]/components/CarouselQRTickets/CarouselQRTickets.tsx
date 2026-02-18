"use client";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, IconButton, Slide, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { MyTicketDto } from "@/models/my-ticket.dto";

import TicketQRCard from "../TicketQRCard/TicketQRCard";

interface CarouselQRTicketsProps {
    tickets: MyTicketDto[];
}

export default function CarouselQRTickets({ tickets }: CarouselQRTicketsProps) {
    const cardsPerPage = 1;

    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    const pages = useMemo(() => {
        if (!tickets) return [];

        return Array.from(
            { length: Math.ceil(tickets.length / cardsPerPage) },
            (_, i) =>
                tickets.slice(i * cardsPerPage, i * cardsPerPage + cardsPerPage)
        );
    }, [tickets]);

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                sx={{ display: pages.length > 1 ? "block" : "none" }}
            >
                <ArrowBackIos sx={{ fontSize: 40 }} />
            </IconButton>

            <Box sx={{ overflow: "hidden" }}>
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
                                key={`${ticket.id}`}
                                sx={{ width: `${100 / cardsPerPage}%` }}
                            >
                                <TicketQRCard ticket={ticket} />
                            </Box>
                        ))}
                    </Stack>
                </Slide>
                <Typography
                    variant="h6"
                    color="secondary"
                    sx={{
                        textAlign: "center",
                        mt: 1,
                        fontWeight: 700
                    }}
                >
                    {currentPage + 1} / {pages.length}
                </Typography>
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