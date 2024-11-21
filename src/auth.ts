// src/auth.ts
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from "@/models/userSchema";
import connectMongoDB from "@/libs/mongodb";

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
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    // Ensure MongoDB connection is established before querying
                    await connectMongoDB();

                    // Find user and explicitly select the password field
                    const user = await User.findOne({ email: credentials.email })
                        .select('+password')
                        .lean();

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    // Add more specific type checking and error handling
                    if (!user.password || typeof user.password !== 'string') {
                        console.log("Invalid password in database");
                        return null;
                    }

                    if (!credentials.password || typeof credentials.password !== 'string') {
                        console.log("Invalid password provided");
                        return null;
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    console.log("Password match:", isMatch);

                    if (isMatch) {
                        // Return user without password
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    } else {
                        console.log("Password mismatch");
                        return null;
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error; // This will help with debugging
                }
            },
        }),
    ],
    pages: {
        signIn: '/login', // Custom login page
        error: '/login',  // Error page
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
});