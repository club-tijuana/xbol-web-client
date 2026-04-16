"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./EventCarousel.module.scss";
import { EventCarouselProps } from "./EventCarousel.types";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function EventCarousel({ events }: EventCarouselProps) {
    const router = useRouter();

    const handleClick = (eventId: number) => {
        if (!eventId) {
            return;
        }

        router.push(`/event/${eventId}`)
    }

    return (
        <Swiper
            spaceBetween={0}
            effect="coverflow"
            navigation={true}
            pagination={{
                clickable: true
            }}
            modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
            className="mainSwiper"
            loop={true}
            autoplay={{
                delay: 3000,
            }}
        >
            {events.map((event, index) => (
                <SwiperSlide key={index}>
                    <Box
                        key={`${event.id}`}
                        className={styles.carouselContainer}
                    >
                        <Image
                            onClick={() => handleClick(event.id)}
                            src={event.bannerImageUrl}
                            alt={event.name}
                            fill
                            className={styles.image}
                        />
                    </Box>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}