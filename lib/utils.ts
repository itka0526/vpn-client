import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "./db";
import { Key } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const deleteKeysFromDB = async (keys: Key[]) =>
    await prisma.key.deleteMany({
        where: {
            keyPath: {
                in: keys.map((x) => x.keyPath),
            },
        },
    });
