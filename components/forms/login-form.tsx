"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { loginUser } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { FormState } from "@/lib/types";
import { useEffect } from "react";
import { SubmitButton } from "../ui/submit-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, EyeIcon } from "lucide-react";
import { config } from "@/lib/config";

export function LoginForm() {
    const initialState: FormState = { message: null, errors: {} };
    const [formState, formAction] = useFormState(loginUser, initialState);

    useEffect(() => {
        if (formState.message) {
            toast.error(formState.message);
        }
    }, [formState.errors, formState.message]);

    return (
        <form className="bg-background flex items-start justify-center h-screen" action={formAction}>
            <Card className="sm:p-8 w-full max-w-md p-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Нэвтрэх</CardTitle>
                    <CardDescription>Нэвтрэхийн тулд и-мэйл хаяг, нууц үгээ оруулна уу.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">И-мэйл хаяг</Label>
                        <Input name="email" id="email" type="email" placeholder="И-мэйл хаягаа оруулна уу" />
                        {formState.errors?.email?.map((err, idx) => (
                            <p className="text-destructive text-sm" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Нууц үг</Label>
                        <Input name="password" id="password" type="password" placeholder="Нууц үгээ оруулна уу" />
                        {formState.errors?.password?.map((err, idx) => (
                            <p className="text-destructive text-sm" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <SubmitButton text="Нэвтрэх" />
                    <Button variant="link" asChild className="text-muted-foreground hover:text-primary px-0 text-sm">
                        <Link href="/register" className="flex items-center">
                            Бүртгэлгүй юу? Бүртгүүлэх
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground hover:text-primary px-0 text-sm"
                        onClick={() => {
                            toast.success("Telegram-аа шалгана уу");
                        }}
                    >
                        <Link href={config.telegramBot + "?start=help"} target="_blank" className="flex items-center">
                            Нэр, нууц үг харах
                            <EyeIcon className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
