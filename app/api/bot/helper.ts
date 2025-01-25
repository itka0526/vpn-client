import prisma from "@/lib/db";
import { User } from "@prisma/client";

export const extendByOneMonth = async (email: User["email"]) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Өгөгдлийн сан хариу өгөхгүй байна.");

        const now = new Date();
        let activeTill = user.activeTill;

        if (now > activeTill) activeTill = now;

        activeTill.setMonth(activeTill.getMonth() + 1);
        await prisma.user.update({ data: { activeTill }, where: { id: user.id } });
    } catch (error) {
        return error;
    }
};

export const extendBySetDays = async (email: User["email"], days: number) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Өгөгдлийн сан хариу өгөхгүй байна.");

        const now = new Date();
        let activeTill = user.activeTill;

        if (now > activeTill) activeTill = now;

        activeTill.setDate(activeTill.getDate() + days);
        await prisma.user.update({ data: { activeTill }, where: { id: user.id } });
    } catch (error) {
        return error;
    }
};
