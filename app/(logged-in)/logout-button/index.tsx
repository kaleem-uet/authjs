"use client"

import { Button } from "@/components/ui/button"
import React from "react"
import { useRouter } from "next/navigation"
import { logout } from "./action"

export default function LogoutButton() {
    const router = useRouter()

    return (
        <Button
            size="sm"
            onClick={async () => {
                try {
                    await logout()
                    router.refresh()
                } catch (error) {
                    console.error("Error during logout:", error)
                }
            }}
        >
            Logout
        </Button>
    )
}

