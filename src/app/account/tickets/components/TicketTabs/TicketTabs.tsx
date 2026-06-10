"use client";

import { Box, Tab, Tabs } from "@mui/material";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { colors } from "@/theme/colors";

import TicketCard from "../TicketCard/TicketCard";

import { TicketTabsProps } from "./TicketTabs.type";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* -------------------- CONSTANTS -------------------- */
const SLIDES_PER_VIEW = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
};

const TAB_KEYS = {
    SEASON_PASS: "SEASON_PASS",
    EVENTS: "EVENTS",
} as const;

type TabKey = typeof TAB_KEYS[keyof typeof TAB_KEYS];

const TAB_LABELS: Record<TabKey, string> = {
    [TAB_KEYS.SEASON_PASS]: "Season Pass",
    [TAB_KEYS.EVENTS]: "Tus tickets",
};

/* -------------------- TYPES -------------------- */
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

/* -------------------- COMPONENTS -------------------- */
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 4 }}>{children}</Box>}
        </div>
    );
}

export default function TicketTabs({
    myEvents,
    mySeasons,
    onEventLoadMore,
    onSeasonLoadMore
}: TicketTabsProps) {
    const [value, setValue] = useState(0);
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);
    const tabs: TabKey[] = [
        TAB_KEYS.SEASON_PASS,
        TAB_KEYS.EVENTS,
    ];

    const tabStyles = {
        border: "solid",
        borderColor: colors.brand.primary,
        color: colors.brand.primary,
        borderWidth: 1,
        borderRadius: 15,
        py: 1,
        px: 3,
        height: 32,
        minHeight: "auto",
        mr: 1.5,
        fontWeight: 400,
        fontSize: 15,
        "&.Mui-selected": {
            backgroundColor: colors.brand.tertiary,
            color: colors.brand.white,
        },
    };

    const getTicketsForTab = (tabKey: TabKey) => {
        switch (tabKey) {
            case TAB_KEYS.SEASON_PASS:
                return mySeasons ?? [];
            case TAB_KEYS.EVENTS:
                return myEvents ?? [];
            default:
                return [];
        }
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ typography: 'body1' }}>
                <Tabs value={value} onChange={handleChange}>
                    {tabs.map(tabKey => (
                        <Tab
                            key={tabKey}
                            label={TAB_LABELS[tabKey]}
                            sx={tabStyles}
                        />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tabKey, index) => (
                <CustomTabPanel key={tabKey} value={value} index={index}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        pagination={{ clickable: true }}
                        navigation={{
                            nextEl: ".tickets-custom-next",
                            prevEl: ".tickets-custom-prev",
                        }}
                        watchOverflow={false}
                        onReachEnd={() => {
                            if (tabKey === "EVENTS") {
                                if (onEventLoadMore) {
                                    onEventLoadMore();
                                }
                            }
                            else {
                                if (onSeasonLoadMore) {
                                    onSeasonLoadMore();
                                }
                            }
                        }}
                        breakpoints={{
                            500: {
                                slidesPerView: SLIDES_PER_VIEW.xs,
                            },
                            600: {
                                slidesPerView: SLIDES_PER_VIEW.sm,
                            },
                            1070: {
                                slidesPerView: SLIDES_PER_VIEW.md,
                            },
                            1200: {
                                slidesPerView: SLIDES_PER_VIEW.lg,
                            },
                            1500: {
                                slidesPerView: SLIDES_PER_VIEW.xl,
                            },
                        }}
                        style={{ overflow: "initial" }}
                    >
                        {getTicketsForTab(tabKey).map((ticket, i) => (
                            <SwiperSlide key={`ticket-${i}`}>
                                <TicketCard ticket={ticket} />
                            </SwiperSlide>
                        ))}
                        <Box
                            className="tickets-custom-prev"
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
                            className="tickets-custom-next"
                            onMouseEnter={() => setHoverNext(true)}
                            onMouseLeave={() => setHoverNext(false)}>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/${hoverNext ? "right-hover.svg" : "right-default.svg"}`}
                                alt="Next"
                                width={35}
                                height={35}
                            />
                        </Box>
                    </Swiper>
                </CustomTabPanel>
            ))}
        </Box>
    );
}