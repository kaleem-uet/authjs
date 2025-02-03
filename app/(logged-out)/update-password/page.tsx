
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UpdatePasswordForm from "./update-password-form"
import db from "@/db/drizzle";
import { passwordResetToken } from "@/db/passwordResetTokenSchema";
import { and, eq, gt } from "drizzle-orm";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams?.token;
    let isValidToken = false;

    if (token) {
        const currentTime = new Date();

        // Query to check if token exists and is not expired
        const resetToken = await db
            .select()
            .from(passwordResetToken)
            .where(
                and(
                    eq(passwordResetToken.token, token),
                    gt(passwordResetToken.tokenExpiry, currentTime) // Check expiry
                )
            );

        isValidToken = resetToken.length > 0;
    }

    console.log("isValidToken", isValidToken);

    return (
        <main className="flex items-center justify-center min-h-screen">
            <Card className="w-[365px]">
                <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {isValidToken ? (
                        <UpdatePasswordForm token={token} />
                    ) : (
                        <div
                            className="
                         items-center
                         justify-center
                        ">
                            <p className="text-red-500 text-center">
                                Invalid or expired password reset link. Please try again.
                            </p>
                            <Link href="password-reset" className="underline">
                                Re sent password reset link
                            </Link>
                        </div>

                    )}
                </CardContent>
            </Card>
        </main >
    );
}
