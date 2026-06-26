"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { heroImageOrDefault } from "@/models/event-image";
import { getEventBannerImageUrl } from "@/models/event-item.dto";

import styles from "./EventCarousel.module.scss";
import { EventCarouselProps } from "./EventCarousel.types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function EventCarousel({
  events,
  fallbackImageUrl,
  fallbackMobileImageUrl,
}: EventCarouselProps) {
  const router = useRouter();
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const hasEvents = events.length > 0;
  const hasMultipleSlides = events.length > 1;
  const fallbackHeroImageUrl = heroImageOrDefault(undefined, fallbackImageUrl);
  const fallbackHeroMobileImageUrl = heroImageOrDefault(
    fallbackMobileImageUrl,
    fallbackImageUrl,
  );

  const handleClick = (eventId: number, isFromSeasonPass: boolean) => {
    if (!eventId) {
      return;
    }
    if (isFromSeasonPass) router.push(`/booking/season/${eventId}`);
    else router.push(`/event/${eventId}`);
  };

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
          clickable: true,
        }}
        modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
        loop={hasMultipleSlides}
        autoplay={hasMultipleSlides ? { delay: 3000 } : false}
      >
        {hasEvents ? events.map((event, index) => {
          const imageUrl = getEventBannerImageUrl(event, fallbackImageUrl);
          const mobileImageUrl = getEventBannerImageUrl(
            event,
            fallbackMobileImageUrl || fallbackImageUrl,
          );

          return (
            <SwiperSlide key={index}>
              <Box
                key={`${event.id}`}
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  aspectRatio: {
                    xs: "1 / 1",
                    md: "16 / 9",
                  },
                  overflow: "hidden",
                }}
              >
                <picture className={styles.picture}>
                  <source media="(max-width: 767px)" srcSet={mobileImageUrl} />
                  <Image
                    onClick={() => handleClick(event.id, event.isFromSeasonPass)}
                    src={imageUrl}
                    alt={event.name}
                    fill
                    className={styles.image}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      cursor: "pointer",
                    }}
                  />
                </picture>
              </Box>
            </SwiperSlide>
          );
        }) : (
          <SwiperSlide>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                aspectRatio: {
                  xs: "1 / 1",
                  md: "16 / 9",
                },
                overflow: "hidden",
              }}
            >
              <picture className={styles.picture}>
                <source
                  media="(max-width: 767px)"
                  srcSet={fallbackHeroMobileImageUrl}
                />
                <img
                  src={fallbackHeroImageUrl}
                  alt="Próximos eventos"
                  className={styles.image}
                />
              </picture>
            </Box>
          </SwiperSlide>
        )}
      </Swiper>

      {hasMultipleSlides && (
        <Box
          className="custom-prev"
          onMouseEnter={() => setHoverPrev(true)}
          onMouseLeave={() => setHoverPrev(false)}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverPrev ? "left-hover.svg" : "left-default.svg"}`}
            alt="Prev"
            width={35}
            height={35}
          />
        </Box>
      )}

      {hasMultipleSlides && (
        <Box
          className="custom-next"
          onMouseEnter={() => setHoverNext(true)}
          onMouseLeave={() => setHoverNext(false)}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverNext ? "right-hover.svg" : "right-default.svg"}`}
            alt="Next"
            width={35}
            height={35}
          />
        </Box>
      )}
    </Box>
  );
}
