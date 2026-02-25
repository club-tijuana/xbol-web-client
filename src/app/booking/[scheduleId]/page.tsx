import { getEventItemBySchedule } from "@/services/bookingService";

import BookingClient from "./components/BookingClient/BookingClient";

interface PageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { scheduleId } = await params;

  const event = await getEventItemBySchedule(Number(scheduleId));

  return (
    <BookingClient scheduleId={scheduleId} event={event} />
  );
}
