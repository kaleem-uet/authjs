'use client'

import { passwordMatchSchema } from "@/validation/passwordMatchSchema"
import { passwordSchema } from "@/validation/passwordSchema"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    password: passwordSchema,

}).and(passwordMatchSchema)
export default function ChangePasswordForm() {
    const form = useForm()
    return (
        <div>ChangePasswordForm</div>
    )
}
