"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./EventCarousel.module.scss";
import { EventCarouselProps } from "./EventCarousel.types";

export default function EventCarousel({ events }: EventCarouselProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying, events.length]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

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
            onClick={() => { handleClick(events[currentIndex].id) }}
        >
            <div
                className={styles.carouselSlide}
            >
                <Image
                    src={events[currentIndex].bannerImageUrl}
                    alt={events[currentIndex].name}
                    fill
                    className={styles.image}
                />
            </div>
        </div>
    );
}