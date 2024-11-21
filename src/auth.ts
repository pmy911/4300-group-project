import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from "@/models/userSchema";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    console.log("Missing email or password");
                    return null;
                }

                try {
                    const user = await User.findOne({ email: credentials.email }).lean();

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    if (typeof credentials.password !== 'string' || typeof user.password !== 'string') {
                        console.log("Invalid password format");
                        return null;
                    }

                    if (!credentials.password.trim() || !user.password.trim()) {
                        console.log("Password cannot be empty");
                        return null;
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);

                    if (isMatch) {
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    } else {
                        console.log("Email or password is incorrect");
                        return null;
                    }
                } catch (error) {
                    console.log("An error occurred: ", error);
                    return null;
                }
            },
        }),
    ],
});
