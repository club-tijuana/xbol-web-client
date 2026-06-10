"use client";

import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { EffectCards, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import TicketQRCard from "../CarouselSlideQRTickets/CarouselSlideQRTicket";

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';

import styles from "./CarouselQRTickets.module.scss";
import { CarouselQRTicketsProps } from "./CarouselQRTickets.type";

export default function CarouselQRTickets({
    tickets,
    isTabActive,
    canLoadMore = false,
    onShare,
    onUnshare,
    onTicketsLoadMore
}: CarouselQRTicketsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const handleResize = () => {
            swiperRef.current?.update();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleShareTicket = (ticketToShareId: number) => {
        onShare(ticketToShareId);
    };

    const handleUnshareTicket = (ticketToUnshareId: number) => {
        onUnshare(ticketToUnshareId);
    };

    return (
        <Box position={"relative"}>
            <Swiper
                effect="cards"
                navigation={{
                    disabledClass: "swiper-button-disabled",
                }}
                modules={[EffectCards, Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className={"ticketSwiper"}
                onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }
                }}
            >
                {tickets.map((ticket, index) => (
                    <SwiperSlide key={ticket.id}>
                        <TicketQRCard
                            ticket={ticket}
                            isActive={activeIndex === index && isTabActive}
                            onShare={handleShareTicket}
                            onUnshare={handleUnshareTicket}
                        />
                    </SwiperSlide>
                ))}

                <Button
                    ref={prevRef}
                    className={styles.ticketPrev}
                    onMouseEnter={() => setHoverPrev(true)}
                    onMouseLeave={() => setHoverPrev(false)}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverPrev ? "left-hover.svg" : "left-default.svg"}`}
                        alt="Prev"
                        width={35}
                        height={35}
                    />
                </Button>

                <Button
                    ref={nextRef}
                    className={styles.ticketNext}
                    onMouseEnter={() => setHoverNext(true)}
                    onMouseLeave={() => setHoverNext(false)}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverNext ? "right-hover.svg" : "right-default.svg"}`}
                        alt="Next"
                        width={35}
                        height={35}
                    />
                </Button>
            </Swiper>



            <Typography
                variant="h6"
                color="secondary"
                sx={{
                    textAlign: "center",
                    mt: 1,
                    fontWeight: 700
                }}
            >
                {activeIndex + 1} / {tickets.length}
            </Typography>

            {canLoadMore && (
                <Box display={"flex"} justifyContent={"center"} mt={2}>
                    <Button variant="outlined" onClick={onTicketsLoadMore}>
                        Cargar más
                    </Button>
                </Box>
            )}
        </Box>
    );
}
