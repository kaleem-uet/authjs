import Link from "next/link"
import LogoutButton from "./logout-button"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function loggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect('/login')
    }
    return (
        <div className="min-h-screen flex flex-col">
            <nav className=" bg-gray-200 flex justify-between p-4">
                <ul className="flex gap-4 ">
                    <li>
                        <Link href='/my-account'>
                            My-account
                        </Link>
                    </li>
                    <li>
                        <Link href='/change-password'>
                            Change password
                        </Link>
                    </li>
                </ul>

                <div>
                    <LogoutButton />

                </div>
            </nav>
            <div className="flex-1 flex justify-center items-center ">
                {
                    children
                }
            </div>
        </div>
    )
}