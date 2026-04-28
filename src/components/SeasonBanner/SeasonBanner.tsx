"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/store/hooks";
import { setBookMode } from "@/store/slices/bookingFlowSlice";

import SeasonBannerProps from "./SeasonBanner.type";

export default function SeasonBanner({ seasonItem }: SeasonBannerProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleSeasonClick = () => {
        dispatch(setBookMode("season"));
        router.push(`/booking/season/${seasonItem.id}`);
    };

    return (
        <Box my={9} sx={{
            position: "relative",
            height: 330
        }}>
            <Image
                src={seasonItem.bannerImageUrl}
                alt="Season"
                fill
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={handleSeasonClick}
            />
        </Box>
    );
}