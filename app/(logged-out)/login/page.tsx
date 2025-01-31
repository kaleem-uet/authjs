"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordSchema } from "@/validation/passwordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginWithCredential } from "./action"
import { useRouter } from "next/navigation"
import Link from "next/link"

const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginSchema) {
        const response = await loginWithCredential({
            email: values.email,
            password: values.password,
        })
        if (response?.error) {
            form.setError("root", {
                type: "manual",
                message: response.message,
            })
        } else {

            router.push('/my-account')
        }
    }
    const email = form.getValues("email")
    return (
        <main className="flex items-center justify-center min-h-screen">
            <Card className="w-[365px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
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
                                {
                                    form.formState.errors.root && (
                                        <FormMessage>
                                            {form.formState.errors.root.message}
                                        </FormMessage>
                                    )}
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>

                            </fieldset>

                        </form>
                        <CardFooter className="flex-col gap-2">
                            <div className="text-muted-foreground text-sm">
                                Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
                            </div>

                            <div className="text-muted-foreground text-sm">
                                Forgot Password?{" "}
                                <Link href={`/password-reset${email ? `?email=${encodeURIComponent(email)}` : ''}`} className="underline">
                                    Reset my Password
                                </Link>
                            </div>
                        </CardFooter>
                    </Form>

                </CardContent>
            </Card>
        </main>
    )
}

