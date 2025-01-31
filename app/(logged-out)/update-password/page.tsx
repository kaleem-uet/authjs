'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UpdatePasswordForm from "./update-password-form"

export default function page() {

    return (
        <main className="flex items-center justify-center min-h-screen">
            <Card className="w-[365px]">
                <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <UpdatePasswordForm />
                </CardContent>
            </Card >
        </main>
    )
}
