"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { viewport } from "@telegram-apps/sdk-react";

export default function FullscreenPage({ children }: PropsWithChildren) {
    useEffect(() => {
        const enableFullscreen = async () => {
            if (viewport.requestFullscreen.isAvailable()) {
                try {
                    await viewport.requestFullscreen();
                    console.log("Fullscreen requested");
                } catch (err) {
                    console.error("Failed to enter fullscreen:", err);
                }
            } else {
                console.warn("Fullscreen API not available");
            }
        };

        enableFullscreen();
    }, []);

    return <>{children}</>;
}
