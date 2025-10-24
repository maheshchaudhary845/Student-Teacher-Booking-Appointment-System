import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    await adminAuth(req);
    await connectDB();

    const users = await User.find().select("-password"); // Exclude passwords
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 401 });
  }
}
