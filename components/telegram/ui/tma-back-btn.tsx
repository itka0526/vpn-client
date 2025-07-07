"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hideBackButton, onBackButtonClick, showBackButton } from "@telegram-apps/sdk-react";

export function TMABackBtn({ children, back = true }: { children: React.ReactNode; back?: boolean }) {
    const router = useRouter();

    useEffect(() => {
        if (back) {
            showBackButton();
            console.log("iran");
            return onBackButtonClick(() => {
                router.back(); // Next.js equivalent of navigate(-1)
            });
        }
        hideBackButton();
    }, [back]);

    return <>{children}</>;
}
