import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, required: true},
    purpose: {type: String, required: true},
    status: {type: String, enum: ["pending", "approved", "cancelled"], default: "pending"},
})

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)