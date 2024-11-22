// src/middleware.ts
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export async function middleware(request: any) {
    const { nextUrl } = request;
    const session = await auth();
    const isAuthenticated = !!session?.user;
    const isAuthPage = nextUrl.pathname.startsWith('/login');

    // If we're on an auth page and already logged in, redirect to tasks
    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/tasks', request.url));
    }

    // If we're not authenticated and trying to access protected routes
    if (!isAuthenticated &&
        ['/tasks', '/add-task', '/edit-task'].some(route =>
            nextUrl.pathname.startsWith(route))) {
        // Store the attempted URL to redirect back after login
        const encodedFrom = encodeURIComponent(nextUrl.pathname);
        return NextResponse.redirect(new URL(`/login?from=${encodedFrom}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/tasks/:path*",
        "/add-task/:path*",
        "/edit-task/:path*",
        "/login"
    ]
};