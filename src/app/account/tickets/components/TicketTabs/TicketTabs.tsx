"use client";

import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { colors } from "@/theme/colors";
import { theme } from "@/theme/theme";

import TicketCard from "../TicketCard/TicketCard";

import { TicketTabsProps } from "./TicketTabs.type";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* -------------------- CONSTANTS -------------------- */
const SLIDES_PER_VIEW = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
};

const TAB_KEYS = {
    SEASON_PASS: "SEASON_PASS",
    EVENTS: "EVENTS",
} as const;

const BREAKPOINTS = {
    MOBILE: "sm",
    TABLET: "md",
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
    mySeasons
}: TicketTabsProps) {
    const [value, setValue] = useState(0);
    const tabs: TabKey[] = [
        ...(mySeasons ? [TAB_KEYS.SEASON_PASS] : []),
        ...(myEvents ? [TAB_KEYS.EVENTS] : []),
    ];

    const isMobile = useMediaQuery(theme.breakpoints.down(BREAKPOINTS.MOBILE));
    const isTablet = useMediaQuery(
        theme.breakpoints.between(BREAKPOINTS.MOBILE, BREAKPOINTS.TABLET)
    );

    const slidesPerView = isMobile
        ? SLIDES_PER_VIEW.mobile
        : isTablet
            ? SLIDES_PER_VIEW.tablet
            : SLIDES_PER_VIEW.desktop;

    const tabStyles = {
        border: "solid",
        borderColor: colors.light.primary,
        color: colors.light.primary,
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
            backgroundColor: colors.light.text,
            color: colors.light.neutral,
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
                        slidesPerView={slidesPerView}
                        spaceBetween={20}
                        pagination={{ clickable: true }}
                        navigation
                    >
                        {getTicketsForTab(tabKey).map((ticket, i) => (
                            <SwiperSlide key={`ticket-${i}`}>
                                <TicketCard ticket={ticket} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CustomTabPanel>
            ))}
        </Box>
    );
}