import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ChangePasswordForm from './change-passsword-form'

export default function page() {
    return (
        <Card className="w-[365px]">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <ChangePasswordForm />

            </CardContent>
        </Card >

    )
}
