import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { adminAuth } from "@/lib/adminAuth";

export async function PATCH(req, { params }) {
  try {
    await adminAuth(req);
    await connectDB();

    const student = await User.findById(params.id);
    if (!student || student.role !== "student") {
      return new Response(JSON.stringify({ message: "Student not found" }), { status: 404 });
    }

    student.approved = true;
    await student.save();

    return new Response(JSON.stringify({ message: "Student approved successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 401 });
  }
}
