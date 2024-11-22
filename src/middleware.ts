import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

// Extract the authentication handler from NextAuth
const { auth } = NextAuth(authConfig);

/**
 * Middleware to handle authentication and route protection.
 * Ensures users are redirected appropriately based on their authentication status.
 */
export async function middleware(request: any) {
    const { nextUrl } = request; // Extract the URL of the incoming request

    try {
        // Get the current session to determine if the user is authenticated
        const session = await auth();
        const isAuthenticated = !!session?.user; // Convert session presence to a boolean
        const isAuthPage = nextUrl.pathname.startsWith('/login'); // Check if the user is on the login page

        // Redirect authenticated users from the login page to the main task dashboard
        if (isAuthPage && isAuthenticated) {
            return NextResponse.redirect(new URL('/tasks', request.url));
        }

        // If the user is not authenticated and is accessing protected routes, redirect to login
        if (
            !isAuthenticated &&
            ['/tasks', '/add-task', '/edit-task'].some(route =>
                nextUrl.pathname.startsWith(route)
            )
        ) {
            // Store the attempted URL to redirect the user back after logging in
            const encodedFrom = encodeURIComponent(nextUrl.pathname);
            return NextResponse.redirect(new URL(`/login?from=${encodedFrom}`, request.url));
        }

        // Allow the request to proceed if no redirection is needed
        return NextResponse.next();
    } catch (error) {
        // Log the error for debugging purposes in development only
        if (process.env.NODE_ENV === 'development') {
            console.error("Middleware error:", error);
        }

        // Redirect to a generic error page or login page in case of failure
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Define the routes the middleware should apply to
export const config = {
    matcher: [
        "/tasks/:path*", // Match all sub-paths under /tasks
        "/add-task/:path*", // Match all sub-paths under /add-task
        "/edit-task/:path*", // Match all sub-paths under /edit-task
        "/login" // Include the login page for redirection logic
    ],
};
