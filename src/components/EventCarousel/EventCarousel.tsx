"use client";

import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, IconButton, Slide, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import styles from "./EventCarousel.module.scss";
import { EventCarouselProps } from "./EventCarousel.types";

export default function EventCarousel({ events }: EventCarouselProps) {
    const router = useRouter();
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

    const itemsPerPage = 1;

    const pages = useMemo(() => {
        if (!events) return [];
        return Array.from(
            { length: Math.ceil(events.length / itemsPerPage) },
            (_, i) =>
                events.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
        );
    }, [events]);

    const currentItems = pages[currentPage] || [];

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying, pages.length]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    const handleNextPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("left");
        setCurrentPage((prev) =>
            prev === pages.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("right");
        setCurrentPage((prev) =>
            prev === 0 ? pages.length - 1 : prev - 1
        );
    };

    const handleClick = (eventId: number) => {
        if (!eventId) {
            return;
        }

        router.push(`/event/${eventId}`)
    }

    return (
        <div
            className={styles.carouselContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <IconButton
                onClick={(e) => handlePrevPage(e)}
                sx={{ zIndex: 2 }}
                color="primary"
            >
                <ArrowBackIos sx={{ fontSize: 40 }} />
            </IconButton>
            <Box className={styles.carouselSlide}
                sx={{ width: "100%", overflow: "hidden" }}
                onClick={() => handleClick(events[currentPage].id)}
            >
                <Slide
                    direction={slideDirection}
                    in
                    mountOnEnter
                    unmountOnExit
                >
                    <Stack direction="row" spacing={2} justifyContent="center">
                        {currentItems.map((item) => (
                            <Box
                                key={`${item.id}`}
                                sx={{ width: `${100 / itemsPerPage}%` }}
                            >
                                <Image
                                    src={events[currentPage].bannerImageUrl}
                                    alt={events[currentPage].name}
                                    fill
                                    className={styles.image}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Slide>
            </Box>
            <IconButton
                onClick={(e) => handleNextPage(e)}
                sx={{ zIndex: 2 }}
                color="primary"
            >
                <ArrowForwardIos sx={{ fontSize: 40 }} />
            </IconButton>
        </div>
    );
}