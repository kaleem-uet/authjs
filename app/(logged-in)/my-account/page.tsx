import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React from 'react'

export default async function page() {
    const session = await auth()
    return (
        <Card className="w-[365px]">
            <CardHeader>
                <CardTitle>My Account</CardTitle>

            </CardHeader>
            <CardContent>

                <Label>
                    Email Address
                </Label>
                <div className='text-muted-foreground  '>
                    {session?.user?.email}
                </div>


            </CardContent >
        </Card >
    )
}
