// src/middleware.ts
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export async function middleware(request: any) {
    const { nextUrl } = request;
    const session = await auth();
    const isAuthenticated = !!session?.user;
    console.log(isAuthenticated, nextUrl.pathname);

    // List of protected routes
    const protectedRoutes = ['/tasks', '/add-task', '/edit-task'];

    // Check if the requested path is a protected route
    if (!isAuthenticated && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/tasks/:path*",
        "/add-task/:path*",
        "/edit-task/:path*"
    ]
};