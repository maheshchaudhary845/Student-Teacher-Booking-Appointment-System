import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }

  const { id } = params;
  const body = await req.json();
  const { status } = body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return new Response(JSON.stringify({ message: "Appointment not found" }), { status: 404 });
    }

    if (user.role === "teacher" && appointment.teacher.toString() !== user.userId) {
      return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
    }

    appointment.status = status;
    await appointment.save();

    return new Response(JSON.stringify({ message: "Updated successfully", appointment }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to update appointment" }), { status: 500 });
  }
}