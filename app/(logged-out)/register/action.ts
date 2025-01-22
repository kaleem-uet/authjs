"use server"

import { passwordMatchSchema } from "@/validation/passwordMatchSchema"
import { z } from "zod"
import { hash } from "bcryptjs"
import { users } from "@/db/userSchema"
import db from "@/db/drizzle"
// register user function action 
export const registerUser = async ({ email, password, confirmPassword }: {
    email: string,
    password: string,
    confirmPassword: string,
}) => {
    try {
        const newUserSchema = z.object({
            email: z.string().email()
        }).and(passwordMatchSchema)
        const validatedData = newUserSchema.safeParse({ email, password, confirmPassword })
        if (!validatedData.success) {
            return {
                error: true,
                message: validatedData.error.issues[0]?.message ?? "An error occurred",
            }
        }
        const hashedPassword = await hash(password, 10)
        // save user to database
        await db.insert(users).values({
            email,
            password: hashedPassword,
        })
    } catch (e: unknown) {
        if (e instanceof Error) {
            if ("code" in e && e.code === "23505") {
                return {
                    error: true,
                    message: "Email already registered",
                }
            }
        }
        return {
            error: true,
            message: "An error occurred",
        }
    }
}
