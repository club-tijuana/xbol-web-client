"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { useAppSelector } from "@/store/hooks";

export default function RegisterPageClient() {
    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);

    useEffect(() => {
        if (!user?.clientId || user.onboardingStatus === "unlinked") {
            return;
        }

        if (user.verificationStatus === "pending") {
            router.replace("/register/verify-email");
            return;
        }

        router.replace("/");
    }, [router, user]);

    return <RegisterForm />;
}
