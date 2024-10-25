"use client";

import { logoutUser } from "@/lib/actions";
import toast from "react-hot-toast";

export const logout = async () => {
    if (await logoutUser()) {
        toast.success("Амжилттай гарлаа.");
    } else {
        toast.error("Алдаа гарлаа.");
    }
};
