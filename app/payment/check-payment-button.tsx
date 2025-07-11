"use client";

import { Button } from "@/components/ui/button";

export function CheckPaymentButton() {
    const checkPayment = async () => {
        const resp = await fetch("/api/telegram/payment", { method: "POST" });
        console.log(resp);
    };

    return (
        <Button variant={"secondary"} onClick={checkPayment}>
            Төлсөн
        </Button>
    );
}
