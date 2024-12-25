"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountDetailsProps {
    content: string;
    className?: string;
}

export function AccountDetails({ content, className }: AccountDetailsProps) {
    const [isCopied, setIsCopied] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);

    const handleCopy = async () => {
        if (spanRef.current) {
            await navigator.clipboard.writeText(spanRef.current.textContent || "");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <span className={cn("relative inline-flex items-center group", className)}>
            <span ref={spanRef} className="pr-6">
                {content}
            </span>
            <button
                onClick={handleCopy}
                className="absolute right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={isCopied ? "Copied" : "Copy to clipboard"}
            >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />}
            </button>
            <span className="sr-only">{isCopied ? "Copied" : "Copy to clipboard"}</span>
        </span>
    );
}
