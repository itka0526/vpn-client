"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createSession } from "./auth";
import prisma from "./db";
import { FormState, LoginUserSchema, RegisterUserSchema } from "./types";
import { redirect } from "next/navigation";

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const rawFormData = Object.fromEntries(formData.entries());
    // Validating data using zod
    const validatedFields = RegisterUserSchema.safeParse(rawFormData);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Алдаатай талбаруудтай байна. Бүртгэл амжилтгүй боллоо.",
        };
    }
    // Creating a new entry in the database
    try {
        const { email, password } = validatedFields.data;
        const currentDate = new Date().toISOString();
        await prisma.user.create({
            data: {
                email,
                password,
                createdAt: currentDate,
                updatedAt: currentDate,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            switch (error.code) {
                // https://www.prisma.io/docs/orm/reference/error-reference
                case "P2002":
                    return {
                        errors: {},
                        message: "Хэрэглэгч аль хэдийн бүртгэлтэй байна.",
                    };
                default:
                    return {
                        errors: {},
                        message: "Өгөгдлийн санд одоогоор бүртгэх боломжгүй байна.",
                    };
            }
        }
        return {
            errors: {},
            message: "Cервер дээр алдаа гарлаа.",
        };
    }
    // If all goes to plan this function should execute
    redirect("/login");
}

export async function loginUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const rawFormData = Object.fromEntries(formData.entries());
    // Validating data using zod
    const validatedFields = LoginUserSchema.safeParse(rawFormData);
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
    redirect("/dashboard");
}
