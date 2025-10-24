import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt"

export async function POST(req){
    try{
        await connectDB()

        const {name, email, password, role, department, subject} = await req.json()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return new Response(JSON.stringify({message: "User already exists"}), {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            approved: role === "teacher" || role === "admin" ? true : false,
            department,
            subject,
        })

        return new Response(JSON.stringify({message: "User registered Successfully", user: newUser}), {status: 201})
    } catch(error){
        console.error(error)
        return new Response(JSON.stringify({message: "Error registering user"}), {status: 500})
    }
}