import { Box } from "@mui/material";
import { Metadata } from "next";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { getSeasonMetadataAsync } from "@/services/seasonService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import BookingSeasonClient from "../../components/BookingSeasonClient/BookingSeasonClient";

interface PageProps {
    params: Promise<{
        seasonId: string;
    }>;
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { seasonId } = await params;
    const seasonIdNumber = Number(seasonId);

    const metadata = await getSeasonMetadataAsync(seasonIdNumber);

    return buildSeoMetadata({
        title: metadata?.title,
        description: metadata?.description ?? "",
        url: "",
        image: metadata.imageUrl,
        type: "website"
    });
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
                <BookingSeasonClient id={seasonId} isRenovation={false} />
            </FullWidthSection>
        </Box>
    );
}
