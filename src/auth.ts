import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from "@/models/userSchema";
import connectMongoDB from "@/libs/mongodb";

// Export handlers and other authentication utilities provided by NextAuth
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        // Configure the credentials provider for custom username/password authentication
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Ensure the credentials object is provided and contains valid fields
                if (!credentials || !credentials.email || !credentials.password) {
                    return null; // Return null to indicate unauthorized
                }

                try {
                    // Connect to MongoDB to access the user database
                    await connectMongoDB();

                    // Find the user by email and include the password field for validation
                    const user = await User.findOne({ email: credentials.email })
                        .select('+password')
                        .lean(); // `lean()` improves query performance by returning plain JS objects

                    // If the user does not exist, return null to indicate authorization failure
                    if (!user) {
                        return null;
                    }

                    // Validate the presence and type of the password in the database
                    if (!user.password || typeof user.password !== 'string') {
                        return null; // Treat missing or invalid password as an authorization failure
                    }

                    if (!credentials.password || typeof credentials.password !== 'string') {
                        return null;
                    }

                    // Compare the provided password with the hashed password in the database
                    const isMatch = await bcrypt.compare(credentials.password, user.password);

                    if (isMatch) {
                        // If the password matches, return user information excluding the password
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    } else {
                        // If the password does not match, return null
                        return null;
                    }
                } catch (error) {
                    // Log the error for debugging purposes
                    console.error("Error during authorization:", error);
                    // Throw a generic error to avoid exposing sensitive details
                    throw new Error("Authorization failed. Please try again later.");
                }
            },
        }),
    ],
    pages: {
        signIn: '/login', // Redirect users to the custom login page
        error: '/login',  // Redirect errors to the login page
    },
    callbacks: {
        /**
         * Add the user's ID to the JWT token.
         * This allows the user's ID to be available during session callbacks.
         */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        /**
         * Add the user's ID to the session object.
         * This ensures the ID is available on the client-side session.
         */
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id; // Include the ID in the session object
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug logs only in development mode
});
