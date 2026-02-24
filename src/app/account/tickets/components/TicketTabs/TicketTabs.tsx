"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { colors } from "@/theme/colors";

import CarouselTickets from "../CarouselTickets/CarouselTickets";

import { TicketTabsProps } from "./TicketTabs.type";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

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
    const tabs = [
        //...(mySeasons ? ["Tus artistas favoritos"] : []),
        ...(mySeasons ? ["Season Pass"] : []),
        ...(myEvents ? ["Tus tickets"] : []),
    ];

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

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ typography: 'body1' }}>
                <Tabs value={value} onChange={handleChange}>
                    {tabs.map((label, index) => (
                        <Tab key={index} label={label} sx={tabStyles} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((label, index) => (
                <CustomTabPanel key={index} value={value} index={index}>
                    <CarouselTickets
                        key={index}
                        tickets={
                            label === "Tus artistas favoritos"
                                ? mySeasons
                                : label === "Season Pass"
                                    ? mySeasons
                                    : myEvents
                        }
                    />
                </CustomTabPanel>
            ))}
        </Box>
    );
}