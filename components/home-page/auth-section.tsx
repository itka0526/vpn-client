"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { isTMA, miniApp, retrieveRawInitData } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export default function AuthSection() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(isTMA());
    }, []);

    useEffect(() => {
        if (!isTMA()) return;

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

                    router.push("/dashboard");
                } else {
                    toast.error(jsonResp?.message);
                }
            } catch (error) {
                toast.error("Нэвтрэлт амжилтгүй!");

                if (miniApp.close.isAvailable()) {
                    miniApp.close();
                }
            }
        };

        requestLogin();
    }, [router]);

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
