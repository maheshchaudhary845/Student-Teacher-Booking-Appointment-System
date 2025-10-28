import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Access Denied. Please login.</p>
            </div>
        );
    }

    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Invalid token. Please login again.</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen p-6">
                <h1 className="md:text-3xl text-xl text-[#45474B] font-bold mb-6">Welcome, <span className="text-[#3F72AF]">{user.name}</span></h1>

                {user.role === "student" && <StudentDashboard user={user} />}
                {user.role === "teacher" && <TeacherDashboard user={user} />}
                {user.role === "admin" && <AdminDashboard user={user} />}
            </div>
        </>
    );
}
