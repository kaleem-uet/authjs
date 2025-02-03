"use server"

import { auth } from "@/auth"
import db from "@/db/drizzle"
import { passwordResetToken } from "@/db/passwordResetTokenSchema"
import { users } from "@/db/userSchema"
import { randomBytes } from "crypto"
import { eq } from "drizzle-orm"
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);
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
    // Send reset token via email
    await resend.emails.send({
        from: "no-reply@yourdomain.com",
        to: emailAddress,
        subject: "Password Reset Request",
        html: `<p>Click <a href="https://localhost:3000/update-password?token=${resetToken}">here</a> to reset your password.</p>`,
    });

    console.log("Password reset token sent to", emailAddress);

}