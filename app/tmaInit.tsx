"use client";

import { PropsWithChildren, useEffect } from "react";
import {
    init,
    setDebug,
    bindThemeParamsCssVars,
    restoreInitData,
    miniApp,
    mountBackButton,
    mountViewport,
    bindViewportCssVars,
} from "@telegram-apps/sdk-react";

export default function TelegramInitializer({ children }: PropsWithChildren) {
    useEffect(() => {
        const initializeTelegram = async () => {
            setDebug(false); // Set true if you want logs

            init(); // <- Initializes internal event handlers

            restoreInitData(); // Restores Telegram WebApp init data

            if (miniApp.mountSync.isAvailable()) {
                miniApp.mountSync(); // Required for full WebApp experience
                bindThemeParamsCssVars(); // Applies Telegram theme to your app
            }

            mountBackButton.ifAvailable(); // Optional: Mount Telegram back button

            if (mountViewport.isAvailable()) {
                await mountViewport();
                bindViewportCssVars(); // Apply viewport size as CSS variables
            }
        };

        initializeTelegram();
    }, []);

    return children; // You don’t render anything here
}
