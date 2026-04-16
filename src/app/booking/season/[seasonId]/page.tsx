import BookingClient from "../../components/BookingClient/BookingClient";

interface PageProps {
    params: Promise<{
        seasonId: string;
    }>;
}

export default async function BookingPage({ params }: PageProps) {
    const { seasonId } = await params;

    return (
        <BookingClient id={seasonId} bookingMode="season" />
    );
}
