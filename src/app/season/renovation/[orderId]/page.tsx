import { Box } from "@mui/material";
import { Metadata } from "next";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { getRenovationMetadataAsync } from "@/services/orderService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import RenovationClientWrapper from "./components/RenovationClientWrapper/RenovationClientWrapper";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { orderId } = await params;
    const orderIdNumber = Number(orderId);

    const metadata = await getRenovationMetadataAsync(orderIdNumber);

    return buildSeoMetadata({
        title: metadata.title,
        description: metadata.description ?? "",
        url: "",
        image: metadata.imageUrl,
        type: "website"
    });
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
