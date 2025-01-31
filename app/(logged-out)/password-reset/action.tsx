"use server"

import { auth } from "@/auth"
import db from "@/db/drizzle"
import { passwordResetToken } from "@/db/passwordResetTokenSchema"
import { users } from "@/db/userSchema"
import { randomBytes } from "crypto"
import { eq } from "drizzle-orm"

export const passwordReset = async (emailAddress: string) => {
    const session = await auth()
    if (!!session?.user?.id) {
        return {
            error: true,
            message: "You are already logged in",
        }
    }

    const user = await db.select({
        id: users.id
    }).from(users).where(eq(users.email, emailAddress))

    if (!user) {
        return;
    }

    // Generate a unique token for password reset
    const resetToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await db.insert(passwordResetToken).values({
        userId: user[0]?.id,
        token: resetToken,
        tokenExpiry,
    }).onConflictDoUpdate({
        target: passwordResetToken.userId,
        set: {
            token: resetToken,
            tokenExpiry
        }
    })
    console.log("this is user", user[0]?.id);

}