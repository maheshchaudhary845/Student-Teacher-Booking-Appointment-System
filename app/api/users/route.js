import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const role = req.nextUrl.searchParams.get("role");
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).select("-password");
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
