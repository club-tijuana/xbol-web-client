import BookingClient from "../components/BookingClient/BookingClient";

interface PageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { scheduleId } = await params;

  return (
    <BookingClient id={scheduleId} bookingMode="event" />
  );
}
