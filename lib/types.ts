import { typeToFlattenedError, z, ZodType } from "zod";

import { User, VPNType } from "@prisma/client";
import { SessionOptions } from "iron-session";

export type PartialUser = Pick<User, "email" | "banned" | "activeTill">;

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email({ message: "Буруу и-мэйл" }),
    password: z.string().min(6, { message: "Нууц үг хэтэрхий богино байна" }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    activeTill: z.coerce.date(),
    banned: z.boolean(),
}) satisfies ZodType<User>;

export const RegisterUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true, activeTill: true, banned: true })
    .extend({
        confirmPassword: z.string().min(6, { message: "Нууц үг хэтэрхий богино байна" }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Нууц үгүүд таарахгүй байна",
                path: ["confirmPassword"],
            });
        }
    });

export const LoginUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true, activeTill: true, banned: true });

export const AllVPNTypes = z.enum(["WireGuardVPN", "OpenVPN", "OutlineVPN"]) satisfies ZodType<VPNType>;

export type FormState = {
    errors?: typeToFlattenedError<z.infer<typeof RegisterUserSchema> | z.infer<typeof LoginUserSchema>>["fieldErrors"];
    message?: string | null;
};

export interface SessionData {
    userId: number | null;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET ?? "development-test-test-123-test-characters-32",
    cookieName: "cookie-monster",
    cookieOptions: {
        secure: true,
    },
};

export interface OutlineVPNResponse {
    id: string;
    name: string;
    password: string;
    port: number;
    method: string;
    accessUrl: string;
}

export const OutlineVPNRespType = z.object({
    id: z.string(),
    name: z.string(),
    password: z.string(),
    port: z.number(),
    method: z.string(),
    accessUrl: z.string(),
}) satisfies ZodType<OutlineVPNResponse>;
