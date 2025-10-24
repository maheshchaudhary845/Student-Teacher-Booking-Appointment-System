import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    approved: {
        type: Boolean, default: function () {
            return this.role === "student" ? false : true;
        }
    },
    department: String,
    subject: String,
})

export default mongoose.models.User || mongoose.model("User", UserSchema)