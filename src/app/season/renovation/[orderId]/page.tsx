import RenovationClientWrapper from "./components/RenovationClientWrapper/RenovationClientWrapper";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function BookingPage({ params }: PageProps) {
    const { orderId } = await params;

    return (
        <RenovationClientWrapper orderId={Number(orderId)} />
    );
}
