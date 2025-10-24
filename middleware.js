export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {


    const token = req.cookies.get("token")?.value

    const { pathname } = req.nextUrl;

    console.log("🔹 Middleware check for:", pathname);

    const publicPaths = ["/login", "/register", "/api/auth/login", "/api/auth/register"]
    const isPublic = publicPaths.some((path) => pathname.startsWith(path));
    if (isPublic) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"]
}