"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export const useCopy = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (copyContent: string) => {
        navigator.clipboard.writeText(copyContent).then(() => {
            setCopied(true);
            toast.success("Хууллаа!");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return { copied, copyToClipboard };
};
