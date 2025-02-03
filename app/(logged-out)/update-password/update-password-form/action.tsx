"use server"

import { auth } from "@/auth"
import db from "@/db/drizzle"
import { passwordResetToken } from "@/db/passwordResetTokenSchema"
import { users } from "@/db/userSchema"
import { hash } from "bcryptjs"
import { and, eq, gt } from "drizzle-orm"

type UpdatePasswordResult = {
    error: boolean
    message: string
    tokenInvalid?: boolean
}

export const updatePassword = async ({
    token,
    newPassword,
    confirmPassword,
}: {
    token: string
    newPassword: string
    confirmPassword: string
}): Promise<UpdatePasswordResult> => {
    const session = await auth()
    if (session?.user?.id) {
        return {
            error: true,
            message: "User already logged in",
        }
    }

    if (!token || newPassword !== confirmPassword) {
        return {
            error: true,
            message: "Invalid token or passwords do not match.",
        }
    }

    const currentTime = new Date()
    const resetTokens = await db
        .select()
        .from(passwordResetToken)
        .where(and(eq(passwordResetToken.token, token), gt(passwordResetToken.tokenExpiry, currentTime)))

    if (!resetTokens.length) {
        return {
            error: true,
            message: "Invalid or expired password reset link. Please try again.",
            tokenInvalid: true,
        }
    }

    const hashedPassword = await hash(newPassword, 10)
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, resetTokens[0].userId))

    await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, resetTokens[0].userId))

    return {
        error: false,
        message: "Password updated successfully",
        tokenInvalid: false,
    }
}

