"use client";

import { Box, Slider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { PriceRangeFilterProps } from "./PriceRangeFilter.types";

export default function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
    const MIN_PRICE = 1;
    const MAX_PRICE = 10000;

    const [range, setRange] = useState<[number, number]>([
        value?.min ?? MIN_PRICE,
        value?.max ?? MAX_PRICE
    ]);

    useEffect(() => {
        onChange({ min: range[0], max: range[1] });
    }, [range, onChange]);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        setRange(newValue as [number, number]);
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val <= range[1] && val >= MIN_PRICE) {
            setRange([val, range[1]]);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val >= range[0] && val <= MAX_PRICE) {
            setRange([range[0], val]);
        }
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    label="Min"
                    type="number"
                    size="small"
                    value={range[0]}
                    onChange={handleMinChange}
                />

                <Slider
                    value={range}
                    onChange={handleSliderChange}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={50}
                    valueLabelDisplay="auto"
                />

                <TextField
                    label="Max"
                    type="number"
                    size="small"
                    value={range[1]}
                    onChange={handleMaxChange}
                />
            </Stack>
        </Box>
    );
}