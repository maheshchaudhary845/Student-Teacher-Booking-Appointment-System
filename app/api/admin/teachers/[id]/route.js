import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { adminAuth } from "@/lib/adminAuth";

export async function PATCH(req, { params }) {
  try {
    await adminAuth(req);
    await connectDB();

    const { name, email, department, subject } = await req.json();

    const updatedTeacher = await User.findByIdAndUpdate(
      params.id,
      { name, email, department, subject },
      { new: true }
    );

    if (!updatedTeacher) return new Response(JSON.stringify({ message: "Teacher not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Teacher updated", updatedTeacher }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 401 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await adminAuth(req);
    await connectDB();
    await params;

    const deleted = await User.findByIdAndDelete(params.id);
    if (!deleted) return new Response(JSON.stringify({ message: "Teacher not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Teacher deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 401 });
  }
}
