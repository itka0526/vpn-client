import {
    setDebug,
    mountBackButton,
    restoreInitData,
    init as initSDK,
    bindThemeParamsCssVars,
    mountViewport,
    bindViewportCssVars,
    mockTelegramEnv,
    type ThemeParams,
    themeParamsState,
    retrieveLaunchParams,
    emitEvent,
    miniApp,
    postEvent,
    viewport,
} from "@telegram-apps/sdk-react";
import { themeParams } from "../theme";

let cssVarsBound = false;
let viewportMountPromise: Promise<void> | null = null;
let fullscreenRequestInProgress = false;

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: { debug: boolean; eruda: boolean; mockForMacOS: boolean }): Promise<void> {
    // Set @telegram-apps/sdk-react debug mode and initialize it.
    setDebug(options.debug);
    initSDK();

    // Add Eruda if needed.
    options.eruda &&
        void import("eruda").then(({ default: eruda }) => {
            eruda.init();
            eruda.position({ x: window.innerWidth - 50, y: 0 });
        });

    // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
    // even response to the "web_app_request_theme" method. It also generates an incorrect
    // event for the "web_app_request_safe_area" method.
    if (options.mockForMacOS) {
        let firstThemeSent = false;
        mockTelegramEnv({
            onEvent(event, next) {
                if (event[0] === "web_app_request_theme") {
                    let tp: ThemeParams = {};
                    if (firstThemeSent) {
                        tp = themeParamsState();
                    } else {
                        firstThemeSent = true;
                        tp ||= retrieveLaunchParams().tgWebAppThemeParams;
                    }
                    return emitEvent("theme_changed", { theme_params: themeParams });
                }

                if (event[0] === "web_app_request_safe_area") {
                    return emitEvent("safe_area_changed", { left: 0, top: 0, right: 0, bottom: 0 });
                }

                next();
            },
        });
    }

    // Mount all components used in the project.

    mountBackButton.ifAvailable();
    restoreInitData();

    if (miniApp.mountSync.isAvailable()) {
        miniApp.mountSync();

        if (!cssVarsBound) {
            bindThemeParamsCssVars();
            cssVarsBound = true;
        }
    }

    if (mountViewport.isAvailable()) {
        if (!viewportMountPromise) {
            viewportMountPromise = mountViewport()
                .then(() => {
                    bindViewportCssVars();
                })
                .catch((err) => {
                    console.error("mountViewport failed", err);
                });
        }
        await viewportMountPromise;
    }

    // Options
    postEvent("web_app_toggle_orientation_lock", { locked: true });
    postEvent("web_app_trigger_haptic_feedback", { type: "notification", notification_type: "success" });
}

async function tryFullscreen() {
    if (fullscreenRequestInProgress || !viewport.requestFullscreen.isAvailable()) return;

    fullscreenRequestInProgress = true;
    try {
        await viewport.requestFullscreen();
        console.log("Entered fullscreen");
    } catch (err) {
        console.error("Fullscreen error:", err);
    } finally {
        fullscreenRequestInProgress = false;
    }
}
