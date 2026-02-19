"use client";

import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { EffectCards, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { MyTicketDto } from "@/models/my-ticket.dto";

import TicketQRCard from "../CarouselSlideQRTickets/CarouselSlideQRTicket";

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';

interface CarouselQRTicketsProps {
    tickets: MyTicketDto[];
    isTabActive: boolean;
}

export default function CarouselQRTickets({ tickets, isTabActive }: CarouselQRTicketsProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const handleResize = () => {
            swiperRef.current?.update();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Swiper
                effect="cards"
                grabCursor={true}
                navigation={true}
                modules={[EffectCards, Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className={"ticketSwiper"}
            >
                {tickets.map((ticket, index) => (
                    <SwiperSlide key={ticket.id}>
                        <TicketQRCard ticket={ticket} isActive={activeIndex === index && isTabActive} />
                    </SwiperSlide>
                ))}
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
        </>
    );
}
