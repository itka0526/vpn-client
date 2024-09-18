import { RegisterForm } from "@/components/forms/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Бүртгүүлэх",
    description: "Бүртгүүлэх хуудас.",
};

export default function Register() {
    return <RegisterForm />;
}
