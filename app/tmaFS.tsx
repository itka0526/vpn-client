"use client";

import { useEffect, useRef } from "react";
import { bindViewportCssVars, init, isTMA, mountViewport, swipeBehavior, viewport } from "@telegram-apps/sdk-react";

export default function TMAFullscreen() {
    const mountedRef = useRef(false);

    useEffect(() => {
        if (mountedRef.current || !isTMA()) return;
        mountedRef.current = true;

        const run = async () => {
            init();

            if (mountViewport.isAvailable()) {
                await mountViewport();
                bindViewportCssVars();
            }

            if (viewport.requestFullscreen.isAvailable()) {
                await viewport.requestFullscreen();
            }

            if (viewport.expand.isAvailable()) {
                viewport.expand();
            }

            if (swipeBehavior.enableVertical.isAvailable()) {
                swipeBehavior.disableVertical();
            }
        };

        run();
    }, []);

    return null;
}
