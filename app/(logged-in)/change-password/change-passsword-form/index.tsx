// 'use client';

// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { passwordSchema } from "@/validation/passwordSchema";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { changePassword } from "./action";

// const formSchema = z
//     .object({
//         currentPassword: passwordSchema,
//         newPassword: passwordSchema,
//         confirmPassword: z.string(),
//     })
//     .refine((data) => data.newPassword === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"],
//     });

// type NewPasswordFormSchema = z.infer<typeof formSchema>;

// export default function ChangePasswordForm() {
//     const form = useForm<NewPasswordFormSchema>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         },
//     });

//     async function onSubmit(values: NewPasswordFormSchema) {
//         try {
//             const res = await changePassword({
//                 currentPassword: values.currentPassword,
//                 newPassword: values.newPassword,
//                 confirmPassword: values.confirmPassword,
//             })
//             if (res?.error) {
//                 form.setError("root", { message: res.message });
//             }
//         } catch (error) {
//             console.error("Error changing password:", error);
//             form.setError("root", { message: "Failed to change password. Please try again." });
//         }
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//                 <fieldset disabled={form.formState.isSubmitting} className="space-y-8">
//                     <FormField
//                         control={form.control}
//                         name="currentPassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Current Password</FormLabel>
//                                 <FormControl>
//                                     <Input placeholder="Enter your current password" {...field} type="password" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={form.control}
//                         name="newPassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>New Password</FormLabel>
//                                 <FormControl>
//                                     <Input placeholder="Enter your new password" {...field} type="password" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={form.control}
//                         name="confirmPassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Confirm Password</FormLabel>
//                                 <FormControl>
//                                     <Input placeholder="Re-enter your new password" {...field} type="password" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     {!!form.formState.errors.root?.message && (
//                         <FormMessage>
//                             {form.formState.errors.root?.message}
//                         </FormMessage>
//                     )}
//                     <Button type="submit" className="w-full">
//                         Submit
//                     </Button>
//                 </fieldset>
//             </form>

//         </Form>
//     );
// }

'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/passwordSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "./action";
import { toast } from "sonner";

const formSchema = z
    .object({
        currentPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type NewPasswordFormSchema = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
    const form = useForm<NewPasswordFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: NewPasswordFormSchema) {
        try {
            const res = await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });
            if (res?.error) {
                form.setError("root", { message: res.message });
            } else {
                // Handle success case, e.g., show a success message
                toast.success(res.message, {
                    description: "Your password has been changed successfully!",
                    className: "bg-green-500 text-white border border-green-700 shadow-lg", // Custom styles
                });

            }
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
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your current password" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </fieldset>
            </form>
        </Form>
    );
}