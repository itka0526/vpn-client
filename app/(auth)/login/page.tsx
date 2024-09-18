import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Нэвтрэх",
    description: "Нэвтрэх хуудас.",
};

export default function Login() {
    return <LoginForm />;
}
