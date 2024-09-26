"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({ text }: { text: string }) {
    const status = useFormStatus();
    return (
        <Button type="submit" className="w-full" aria-disabled={status.pending}>
            {status.pending ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Түр хүлээнэ үү...
                </>
            ) : (
                text
            )}
        </Button>
    );
}
