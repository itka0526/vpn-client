"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { loginUser } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { FormState } from "@/lib/types";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export function LoginForm() {
    const initialState: FormState = { message: null, errors: {} };
    const [formState, formAction, isPending] = useFormState(loginUser, initialState);

    useEffect(() => {
        if (formState.message) {
            toast.error(formState.message);
        }
    }, [formState.errors, formState.message]);

    return (
        <form className="flex items-start justify-center h-screen bg-background" action={formAction}>
            <Card className="w-full max-w-md p-6 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Нэвтрэх</CardTitle>
                    <CardDescription>Нэвтрэхийн тулд и-мэйл хаяг, нууц үгээ оруулна уу.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">И-мэйл хаяг</Label>
                        <Input name="email" id="email" type="email" placeholder="И-мэйл хаягаа оруулна уу" />
                        {formState.errors?.email?.map((err, idx) => (
                            <p className="text-sm text-destructive" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Нууц үг</Label>
                        <Input name="password" id="password" type="password" placeholder="Нууц үгээ оруулна уу" />
                        {formState.errors?.password?.map((err, idx) => (
                            <p className="text-sm text-destructive" key={`${err}${idx}`}>
                                {err}
                            </p>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" aria-disabled={isPending}>
                        Нэвтрэх
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
