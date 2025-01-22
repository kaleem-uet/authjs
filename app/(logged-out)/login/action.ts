"use server"

import { z } from "zod"
import { passwordSchema } from "@/validation/passwordSchema"
import { signIn } from "@/auth"
// register user function action 
export const loginWithCredential = async ({ email, password }: {
    email: string,
    password: string,
}) => {

    const loginSchema = z.object({
        email: z.string().email(),
        password: passwordSchema,
    })

    const loginValidation = loginSchema.safeParse({ email, password })
    if (!loginValidation.success) {
        return {
            error: true,
            message: loginValidation.error.issues[0]?.message ?? "An error occurred",
        }
    }
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        console.log("email: ", email, password);
    } catch {
        return {
            error: true,
            message: "Incorrect Email or password",
        }
    }

} 
