import jwt from "jsonwebtoken";
import connectDB from "./mongoose";
import User from "../models/User";

export async function adminAuth(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const user = await User.findById(decoded.userId);
  if (!user || user.role !== "admin") throw new Error("Forbidden");

  return user;
}
