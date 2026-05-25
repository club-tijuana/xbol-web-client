import AccountAuthGuard from "./AccountAuthGuard";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AccountAuthGuard>
            {children}
        </AccountAuthGuard>
    );
}
