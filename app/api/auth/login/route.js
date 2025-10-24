import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB()

        const { email, password } = await req.json()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const response = NextResponse.json({ message: "Login Successful", user: { id: user._id, email: user.email, role: user.role } }, { status: 200 })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        })

        return response

    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}