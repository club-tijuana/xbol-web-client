"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { publicEnv } from "@/config/env";
import { canUseVerifiedClientFeatures } from "@/helpers/authStateHelper";
import { useAppSelector } from "@/store/hooks";

const emailAuthEnabled = publicEnv.NEXT_PUBLIC_ENABLE_EMAIL_AUTH;

export default function AccountAuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);
    const isPendingVerification = emailAuthEnabled && user && !canUseVerifiedClientFeatures(user);

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
