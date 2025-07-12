"use client";

import { useEffect, useRef } from "react";
import { bindViewportCssVars, init, mountViewport, viewport } from "@telegram-apps/sdk-react";

export default function TMAFullscreen() {
    const mountedRef = useRef(false);

    useEffect(() => {
        if (mountedRef.current) return;
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
        };

        run();
    }, []);

    return null;
}
