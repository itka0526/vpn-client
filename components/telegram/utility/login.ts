import { createSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { LoginUserSchema } from "@/lib/types";
import { redirect } from "next/navigation";

export async function loginTelegramUser(): Promise<unknown> {
    // Validating data using zod
    const validatedFields = LoginUserSchema.safeParse({});
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Алдаатай талбаруудтай байна. Нэвтрэлт амжилтгүй боллоо.",
        };
    }
    try {
        // Finding the user
        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                errors: {},
                message: "Та эхлээд бүртгүүлнэ үү.",
            };
        }
        // Check passwords
        if (user.password !== password) {
            return {
                errors: {},
                message: "Нууц үг буруу байна.",
            };
        }
        await createSession(user);
    } catch (error) {
        console.error(error);
        return {
            errors: {},
            message: "Сервер дээр алдаа гарлаа.",
        };
    }
    return redirect("/dashboard");
}
