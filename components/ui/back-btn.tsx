"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackBtn() {
    const router = useRouter();
    return (
        <Button variant="link" className="flex items-center px-0 mt-2 ml-4 text-sm text-white" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Буцах
        </Button>
    );
}
