"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { getEventBannerImageUrl } from "@/models/event-item.dto";

import styles from "./EventCarousel.module.scss";
import { EventCarouselProps } from "./EventCarousel.types";

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function EventCarousel({ events }: EventCarouselProps) {
    const router = useRouter();
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);

    const handleClick = (eventId: number) => {
        if (!eventId) {
            return;
        }

        router.push(`/event/${eventId}`)
    }

    return (
        <Box>
            <Swiper
                spaceBetween={0}
                effect="coverflow"
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                    disabledClass: "swiper-button-disabled",
                }}
                pagination={{
                    clickable: true
                }}
                modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
                loop={true}
                autoplay={{
                    delay: 3000,
                }}
            >
                {events.map((event, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            key={`${event.id}`}
                            sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                aspectRatio: "16 / 9",
                                overflow: "hidden"
                            }}
                        >
                            <Image
                                onClick={() => handleClick(event.id)}
                                src={getEventBannerImageUrl(event)}
                                alt={event.name}
                                fill
                                className={styles.image}
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    cursor: "pointer"
                                }}
                            />
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Box
                className="custom-prev"
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverPrev ? "left-hover.svg" : "left-default.svg"}`}
                    alt="Prev"
                    width={35}
                    height={35}
                />
            </Box>

            <Box
                className="custom-next"
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverNext ? "right-hover.svg" : "right-default.svg"}`}
                    alt="Next"
                    width={35}
                    height={35}
                />
            </Box>
        </Box>
    );
}
