import connectDB from "@/lib/mongoose";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }

  let appointments;
  if (user.role === "student") {
    appointments = await Appointment.find({ student: user.userId })
        .populate("teacher", "name email subject")
        .populate("student", "name email department");
} else if (user.role === "teacher") {
    appointments = await Appointment.find({ teacher: user.userId })
        .populate("teacher", "name email subject")
        .populate("student", "name email department"); 
} else {
    appointments = await Appointment.find()
        .populate("student teacher", "name email role");
}

  return new Response(JSON.stringify({ appointments }), { status: 200 });
}

export async function POST(req) {
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

  try {
    const { teacherId, date, purpose } = await req.json();

    if (user.role !== "student") {
      return new Response(JSON.stringify({ message: "Only students can book appointments" }), { status: 403 });
    }

    const appointment = await Appointment.create({
      student: user.userId,
      teacher: teacherId,
      date,
      purpose,
    });

    const populatedAppointment = await appointment.populate("teacher", "name email subject");

    return new Response(JSON.stringify({ message: "Appointment created", appointment: populatedAppointment }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to create appointment" }), { status: 500 });
  }
}
