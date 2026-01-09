import BookingFlow from "@/components/Booking/BookingFlow";

interface PageProps {
  params: Promise<{
    eventKey: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { eventKey } = await params;

  return <BookingFlow eventKey={eventKey} />;
}
