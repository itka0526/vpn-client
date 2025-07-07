"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { isTMA, retrieveLaunchParams, retrieveRawInitData } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { init } from "../telegram/core/init";

export default function AuthSection() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(isTMA());
    }, []);

    useEffect(() => {
        if (!isTMA()) return;

        const initializeTMA = async () => {
            // Initialization Parameters
            const launchParams = retrieveLaunchParams();
            const { tgWebAppPlatform: platform } = launchParams;
            const debug = (launchParams.tgWebAppStartParam || "").includes("platformer_debug") || process.env.NODE_ENV === "development";

            // Initialize TMA
            init({
                debug,
                eruda: debug && ["ios", "android"].includes(platform),
                mockForMacOS: platform === "macos",
            });
        };

        const initDataRaw = retrieveRawInitData();
        if (!initDataRaw) return;

        const requestLogin = async () => {
            try {
                const resp = await fetch("/api/telegram/login", {
                    method: "POST",
                    headers: {
                        Authorization: `tma ${initDataRaw}`,
                    },
                });
                const jsonResp = await resp.json();

                if (resp.status === 200) {
                    toast.success(jsonResp?.message);

                    // On success install TMA
                    await initializeTMA();
                    router.push("/dashboard");
                } else {
                    toast.error(jsonResp?.message);
                }
            } catch (error) {
                toast.error("Нэвтрэлт амжилтгүй!");
            }
        };

        requestLogin();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <Link href={"/register"} className="flex justify-center w-full">
                <Button variant="outline" className="w-full">
                    Бүртгүүлэх
                </Button>
            </Link>
            <Link href={"/login"} className="flex justify-center w-full">
                <Button variant="default" className="w-full">
                    Нэвтрэх
                </Button>
            </Link>
        </>
    );
}
