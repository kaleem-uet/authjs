"use server"
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/userSchema";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

type ChangePasswordResponse = {
    error: boolean;
    message: string;
};

export const changePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
}: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<ChangePasswordResponse> => {
    const session = await auth();
    if (!session) {
        return { error: true, message: "Not authenticated" };
    }

    const formSchema = z.object({
        currentPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    const passwordValidation = formSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!passwordValidation.success) {
        return {
            error: true,
            message: passwordValidation.error.issues[0]?.message ?? "An error occurred",
        };
    }

    const userId = session.user?.id;

    if (!userId) {
        return {
            error: true,
            message: "User not authenticated"
        };
    }

    const [user] = await db.select().from(users).where(eq(users.id, parseInt(userId)));
    if (!user) {
        return { error: true, message: "User not found" };
    }

    const passwordMatch = await compare(currentPassword, user.password!);
    if (!passwordMatch) {
        return { error: true, message: "Incorrect current password" };
    }

    const hashedPassword = await hash(newPassword, 10);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, parseInt(userId)));

    return { error: false, message: "Password changed successfully" };
};
