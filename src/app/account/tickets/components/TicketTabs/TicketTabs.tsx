"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { colors } from "@/theme/colors";


import TicketList from "../TicketList/TicketList";

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
        ...(myEvents && myEvents.length > 0 ? ["Tus artistas favoritos"] : []),
        ...(mySeasons && mySeasons.length > 0 ? ["Xolopass"] : []),
        ...(myEvents && myEvents.length > 0 ? ["Tus tickets"] : []),
    ];

    console.log("Ticket Tabs:", myEvents);

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
                    <TicketList
                        listKey={index.toString()}
                        tickets={
                            label === "Tus artistas favoritos"
                                ? myEvents
                                : label === "Xolopass"
                                    ? mySeasons
                                    : myEvents
                        }
                        title={label}
                    />
                </CustomTabPanel>
            ))}
        </Box>
    );
}