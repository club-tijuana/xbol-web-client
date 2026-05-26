import { Box } from "@mui/material";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { colors } from "@/theme/colors";

import BookingClient from "../../components/BookingClient/BookingClient";

interface PageProps {
    params: Promise<{
        seasonId: string;
    }>;
}

export default async function BookingPage({ params }: PageProps) {
    const { seasonId } = await params;

    return (
        <Box>
            <FullWidthSection
                variant="colorFixedHeight"
                backgroundColor={colors.ui.surface}
                bottomRounded={true}
                height={750}
            >
                <BookingClient id={seasonId} bookingMode="season" />
            </FullWidthSection>
        </Box>
    );
}
