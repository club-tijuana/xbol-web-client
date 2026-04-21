import { Box } from "@mui/material";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { colors } from "@/theme/colors";

import RenovationClientWrapper from "./components/RenovationClientWrapper/RenovationClientWrapper";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function BookingPage({ params }: PageProps) {
    const { orderId } = await params;

    return (
        <Box>
            <FullWidthSection
                variant="colorFixedHeight"
                backgroundColor={colors.ui.surface}
                bottomRounded={true}
                height={750}
            >
                <RenovationClientWrapper orderId={Number(orderId)} />
            </FullWidthSection>
        </Box>
    );
}
