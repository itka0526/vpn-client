"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/actions";
import { FormState } from "@/lib/types";
import { useFormState } from "react-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { SubmitButton } from "../ui/submit-button";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export function RegisterForm() {
    const initialState: FormState = { message: null, errors: {} };
    const [formState, formAction] = useFormState(registerUser, initialState);

    useEffect(() => {
        if (formState.message) {
            toast.error(formState.message);
        }
    }, [formState.errors, formState.message]);

    return (
        <form className="flex items-start justify-center h-screen bg-background" action={formAction}>
            <Card className="w-full max-w-md p-6 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Бүртгүүлэх</CardTitle>
                    <CardDescription>Шинэ хэрэглэгч үүсгэхийн тулд та мэдээллээ оруулна уу.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">И-мэйл</Label>
                        <Input required id="email" name="email" type="email" placeholder="И-мэйл хаягаа оруулна уу" />
                        {formState.errors?.email?.map((err, idx) => (
                            <p className="text-sm text-destructive" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Нууц үг</Label>
                        <Input required id="password" name="password" type="password" placeholder="Нууц үгээ оруулна уу" />
                        {formState.errors?.password?.map((err, idx) => (
                            <p className="text-sm text-destructive" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Нууц үг баталгажуулах</Label>
                        <Input required id="confirmPassword" name="confirmPassword" type="password" placeholder="Нууц үгээ баталгажуулна уу" />
                        {formState.errors?.confirmPassword?.map((err, idx) => (
                            <p className="text-sm text-destructive" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <SubmitButton text="Бүртгүүлэх" />
                    <Button variant="link" asChild className="px-0 text-sm text-muted-foreground hover:text-primary">
                        <Link href="/login" className="flex items-center">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Бүртгэлтэй юу? Нэвтрэх
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
