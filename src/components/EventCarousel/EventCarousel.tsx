"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./EventCarousel.module.scss";

export default function EventCrousel() {
    const slides = [
        {
            id: 1,
            image: "/assets/images/main-events/event-1.png",
            alt: "Evento 1"
        },
        {
            id: 2,
            image: "/assets/images/main-events/event-2.png",
            alt: "Evento 2"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval: any;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    return (
        <div
            className={styles.carouselContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
            <div
                className={styles.carouselSlide}
            >
                <Image
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].alt}
                    fill
                    className={styles.image}
                />
            </div>
        </div>
    );
}