"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { passwordReset } from "./action"

const formSchema = z.object({
    email: z.string().email(),
})

export default function Page() { // Capitalized component name
    const searchParams = useSearchParams()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: decodeURIComponent(searchParams.get("email") ?? ""),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await passwordReset(values.email) // Ensure passwordReset handles errors properly
        } catch (error) {
            console.error("Password reset failed:", error)
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen">
            <Card className="w-[365px]">
                <CardHeader>
                    <CardTitle>Password Reset</CardTitle>
                    <CardDescription>Enter your Email address to reset password</CardDescription>
                </CardHeader>
                <CardContent>
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
                                {form.formState.errors?.root?.message && ( // Prevent potential undefined error
                                    <FormMessage>
                                        {form.formState.errors.root.message}
                                    </FormMessage>
                                )}
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>
                            </fieldset>
                        </form>
                        <CardFooter className="flex-col gap-2 mt-2">
                            <div className="text-muted-foreground text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/login" className="underline">
                                    Login
                                </Link>
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Forgot Password?{" "}
                                <Link href="/register" className="underline">
                                    Register
                                </Link>
                            </div>
                        </CardFooter>
                    </Form>
                </CardContent>
            </Card>
        </main>
    )
}
