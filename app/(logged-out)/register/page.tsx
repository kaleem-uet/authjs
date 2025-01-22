"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordMatchSchema } from "@/validation/passwordMatchSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Link from "next/link"
import { registerUser } from "./action"

const registerSchema = z
    .object({
        email: z.string().email(),
    })
    .and(passwordMatchSchema)

type RegistrationSchema = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const form = useForm<RegistrationSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: RegistrationSchema) {
        const response = await registerUser({
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        })

        if (response?.error) {
            form.setError("email", {
                type: "manual",
                message: response.message,
            })
        }
        console.log("response", response)
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            {form.formState.isSubmitSuccessful ? (
                <Card className="w-[365px]">
                    <CardHeader>
                        <CardTitle>Your account has been created successfully</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/login">Login to your account</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-[365px]">
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Register for new account</CardDescription>
                    </CardHeader>
                    <CardContent >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <fieldset disabled={form.formState.isSubmitting} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} type="email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Password" {...field} type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Confirm Password" {...field} type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Submit
                                    </Button>
                                </fieldset>
                            </form>
                            <CardFooter className="flex-col gap-2">
                                <div className="text-muted-foreground text-sm">
                                    Already have and account? <Link href="/login" className="underline">login</Link>
                                </div>


                            </CardFooter>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

