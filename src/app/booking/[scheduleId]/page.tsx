import { Box } from "@mui/material";

import FullWidthSection from "@/components/FullWidthSection/FullWidthSection";
import { colors } from "@/theme/colors";

import BookingClient from "../components/BookingClient/BookingClient";

interface PageProps {
  params: Promise<{
    scheduleId: string;
  }>;
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
        <BookingClient id={scheduleId} bookingMode="event" />
      </FullWidthSection>
    </Box>
  );
}
