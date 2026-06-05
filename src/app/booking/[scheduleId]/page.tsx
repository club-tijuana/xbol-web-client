import { Box } from "@mui/material";
import { Metadata } from "next";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { getEventMetadataByScheduleIdAsync } from "@/services/eventService";
import { colors } from "@/theme/colors";
import { buildSeoMetadata } from "@/utils/seo/seoBuilder";

import BookingClient from "../components/BookingClient/BookingClient";

interface PageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { scheduleId } = await params;
  const scheduleIdNumber = Number(scheduleId);

  const eventMetadata = await getEventMetadataByScheduleIdAsync(scheduleIdNumber);

  return buildSeoMetadata({
    title: eventMetadata.title,
    description: eventMetadata.description ?? "",
    url: "",
    image: eventMetadata.imageUrl,
    type: "website"
  });
}

export default async function BookingPage({ params }: PageProps) {
  const { scheduleId } = await params;

  return (
    <Box>
      <FullWidthSection
        variant="colorFixedHeight"
        backgroundColor={colors.ui.surface}
        bottomRounded={true}
        height={750}
      >
        <BookingClient id={scheduleId} />
      </FullWidthSection>
    </Box>
  );
}
