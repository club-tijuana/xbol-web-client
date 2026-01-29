"use client";

import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TicketCard from "../TicketCard/TicketCard";
import { TicketListProps } from "./TicketList.type";
import { MyTicketDto } from "@/models/my-ticket.dto";

export default function TicketList({ title, tickets }: TicketListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [visibleTickets, setVisibleTickets] = useState<MyTicketDto[]>([]);

  useEffect(() => {
    const calculateVisibleCount = () => {
      const width = window.innerWidth;

      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      return 1;
    };

    const update = () => {
      setVisibleCount(calculateVisibleCount());
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!tickets) {
      setVisibleTickets([]);
      return;
    }

    setVisibleTickets(
      tickets.slice(currentIndex, currentIndex + visibleCount)
    );
  }, [tickets, currentIndex, visibleCount]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!tickets) return;

    setCurrentIndex(prev =>
      Math.min(tickets.length - visibleCount, prev + 1)
    );
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
        <Grid container columns={2}>
            <Grid size={1}>
                <Typography variant="h2" className="textPrimary" mb={3}>
                    {title}
                </Typography>
            </Grid>
            {
                (tickets !== null && tickets.length > 3) &&
                <Grid size={1}>
                    <Box sx={{ display: "flex", justifyContent: 'end' }}>
                        <IconButton
                            aria-label="Anterior"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            sx={{ color: currentIndex > 0 ? 'var(--color-text-primary)' : '' }}
                        >
                            <ArrowBackIos sx={{ fontSize: 50 }} />
                        </IconButton>

                        <IconButton
                            aria-label="Siguiente"
                            onClick={handleNext}
                            disabled={
                                !tickets || currentIndex >= tickets.length - visibleCount
                            }
                            sx={{ color: (!tickets || currentIndex >= tickets.length - visibleCount) ? '' : 'var(--color-text-primary)' }}
                        >
                            <ArrowForwardIos sx={{ fontSize: 50 }} />
                        </IconButton>
                    </Box>
                </Grid>
            }
        </Grid>

        <Box sx={{ position: "relative" }}>
            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                gap: 2,
                }}
            >
                {visibleTickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </Box>

            {tickets &&
                tickets.length > visibleCount &&
                visibleCount >= 3 &&
                currentIndex < tickets.length - visibleCount && (
                    <Box
                        sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "10%",
                        height: "100%",
                        pointerEvents: "none",
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
                        }}
                    />
                )}

            {tickets &&
                tickets.length > visibleCount &&
                visibleCount >= 3 &&
                currentIndex > 0 && (
                    <Box
                        sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "10%",
                        height: "100%",
                        pointerEvents: "none",
                        background:
                            "linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
                        }}
                    />
                )}
        </Box>
    </Box>
  );
}
