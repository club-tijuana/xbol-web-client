"use client";

import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { BundleItemDTO, getBundleBannerImageUrl } from "@/models/bundle-item.dto";
import { getBundleBanner } from "@/services/bundleService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBookMode } from "@/store/slices/bookingFlowSlice";
import { showGeneralMessage } from "@/store/slices/uiSlice";
import { colors } from "@/theme/colors";

export default function SeasonBanner() {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.auth.user?.token);
    const router = useRouter();
    const [bundleBanner, setBundleBanner] = useState<BundleItemDTO>();

    useEffect(() => {
        if (!token) {
            return;
        }

        const loadSeason = async () => {
            try {
                const response = await getBundleBanner();

                if (response) {
                    setBundleBanner(response);
                }
            }
            catch (error) {
                dispatch(showGeneralMessage({
                    message: getErrorMessage(error),
                    severity: "error"
                }));
            }
        };

        loadSeason();
    }, [token]);

    const handleSeasonClick = () => {
        if (!bundleBanner) {
            return;
        }

        dispatch(setBookMode("season"));
        router.push(`/booking/season/${bundleBanner.id}`);
    };

    return (
        <>
            {bundleBanner &&
                <Box>
                    <Typography
                        variant="h3"
                        color={colors.brand.primary}
                    >
                        Temporadas
                    </Typography>
                    <Grid container columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}>
                        <Grid size={1}>
                            <Box mb={9} mt={1} sx={{
                                position: "relative",
                                aspectRatio: "16 / 9"
                            }}>
                                <Image
                                    src={getBundleBannerImageUrl(bundleBanner)}
                                    alt="Season"
                                    fill
                                    style={{
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: 10
                                    }}
                                    onClick={handleSeasonClick}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }
        </>
    );
}
