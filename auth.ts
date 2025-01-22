import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import db from "./db/drizzle"
import { users } from "./db/userSchema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { passwordSchema } from "./validation/passwordSchema"
import { compare } from "bcryptjs"
const authSchema = z.object({
    email: z.string().email(),
    password: passwordSchema
})
export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                try {
                    // Validate credentials schema
                    const { email, password } = authSchema.parse(credentials);

                    // Query user from database
                    const user = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, email))
                        .limit(1)
                        .then((res) => res[0]);
                    console.log("issue in db connection");

                    if (!user) {
                        console.error("User not found:", email);
                        return null;
                    }

                    // Compare password
                    const passwordCorrect = await compare(password, user.password as string);
                    if (!passwordCorrect) {
                        console.error("Incorrect password for email:", email);
                        return null;
                    }

                    // Return user object
                    return {
                        id: user.id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Authorize function error:", error);
                    return null;
                }
            }

        }),
    ],
})


// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { compare } from "bcryptjs"
// import { db } from "@/db/drizzle"
// import { users } from "@/db/schema"
// import { eq } from "drizzle-orm"
// import { z } from "zod"

// const authSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8),
// })

// export const { handlers, auth } = NextAuth({
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const { email, password } = authSchema.parse(credentials)

//                     const user = await db.query.users.findFirst({
//                         where: eq(users.email, email),
//                     })

//                     if (!user) {
//                         return null
//                     }

//                     const passwordCorrect = await compare(password, user.password)

//                     if (!passwordCorrect) {
//                         return null
//                     }

//                     return {
//                         id: user.id.toString(),
//                         email: user.email,
//                     }
//                 } catch (error) {
//                     console.error("Auth error:", error)
//                     return null
//                 }
//             },
//         }),
//     ],
//     pages: {
//         signIn: "/login",
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//                 token.email = user.email
//             }
//             return token
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user.id = token.id
//                 session.user.email = token.email
//             }
//             return session
//         },
//     },
// })

// export { handlers as GET, handlers as POST }

