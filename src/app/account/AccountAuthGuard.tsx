"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { canUseVerifiedClientFeatures } from "@/helpers/authStateHelper";
import { useAppSelector } from "@/store/hooks";

export default function AccountAuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);
    const isPendingVerification = user && !canUseVerifiedClientFeatures(user);

    useEffect(() => {
        if (isPendingVerification) {
            router.replace("/register/verify-email");
        }
    }, [isPendingVerification, router]);

    if (isPendingVerification || pathname === "/register/verify-email") {
        return null;
    }

    return children;
}
