import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { adminAuth } from "@/lib/adminAuth";

export async function POST(req) {
  try {
    await adminAuth(req);

    await connectDB();
    const { name, email, password, department, subject } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Teacher already exists" }), { status: 400 });
    }

    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      department,
      subject,
    });

    await teacher.save();

    return new Response(JSON.stringify({ message: "Teacher created successfully", teacher }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 401 });
  }
}
