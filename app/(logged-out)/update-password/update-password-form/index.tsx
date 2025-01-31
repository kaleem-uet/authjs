'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/passwordSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFooter } from "@/components/ui/card";
import Link from "next/link";

const formSchema = z
    .object({
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type NewPasswordFormSchema = z.infer<typeof formSchema>;

export default function UpdatePasswordForm() {
    const form = useForm<NewPasswordFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: NewPasswordFormSchema) {
        try {
            console.log(values);

        } catch (error) {
            console.error("Error changing password:", error);
            form.setError("root", { message: "Failed to change password. Please try again." });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset disabled={form.formState.isSubmitting} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your new password" {...field} type="password" />
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
                                    <Input placeholder="Re-enter your new password" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.formState.errors.root?.message && (
                        <FormMessage>
                            {form.formState.errors.root.message}
                        </FormMessage>
                    )}
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                    <CardFooter className="flex-col gap-2">
                        <div className="text-muted-foreground text-sm">
                            <Link href="/login" className="underline">
                                Login to your account
                            </Link>
                        </div>


                    </CardFooter>
                </fieldset>
            </form>
        </Form>
    );
}
