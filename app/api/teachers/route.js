import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const teachers = await User.find({ role: "teacher" }).select("-password"); 
        return NextResponse.json({ teachers });
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
    }
}