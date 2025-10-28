"use client";
import { useEffect, useState } from "react";

export default function StudentDashboard({ user }) {
    const [teachers, setTeachers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [date, setDate] = useState("");
    const [purpose, setPurpose] = useState("");
    const [loading, setLoading] = useState(false);
    const [homeLoading, setHomeLoading] = useState(false)

    useEffect(() => {
        async function fetchTeachers() {
            const res = await fetch("/api/users?role=teacher");
            const data = await res.json();
            setTeachers(data.users || []);
        }
        fetchTeachers();
    }, []);

    const fetchAppointments = async () => {
        setHomeLoading(true)
        const res = await fetch("/api/appointments", { credentials: "include" });
        const data = await res.json();
        setAppointments(data.appointments || []);
        setHomeLoading(false)
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ teacherId, date, purpose }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            setTeacherId("");
            setDate("");
            setPurpose("");
            fetchAppointments();
        } else {
            alert(data.message);
        }
    };

    if (homeLoading) return <div className='fixed inset-0 flex space-x-2 justify-center items-center'>
        <span className='sr-only'>Loading...</span>
        <div className='h-8 w-8 bg-[#A5D7E8] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-[#548fa2] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-[#115b74] rounded-full animate-bounce'></div>
    </div>

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Book an Appointment</h2>
            <form
                onSubmit={handleBook}
                className="backdrop-blur-[1px] p-4 rounded-lg shadow-lg mb-6 flex flex-col gap-3 max-w-5xl mx-auto"
            >
                <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                            {t.name} ({t.email})
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="border rounded px-3 py-2"
                    required
                />

                <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Purpose of appointment"
                    className="border rounded px-3 py-2"
                    required
                />
                {user.role === "student" &&
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#3F72AF] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#2067be]"
                    >
                        {loading ? "Booking..." : "Book Appointment"}
                    </button>
                }
            </form>

            <h2 className="text-xl font-semibold mb-3 text-center">My Appointments</h2>
            <div className="bg-sky-500/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                {appointments.length === 0 ? (
                    <p>No appointments yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {appointments.map((appt) => (
                            <li
                                key={appt._id}
                                className="border border-black/20 hover:bg-sky-100 rounded shadow-lg p-2 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">{appt?.teacher?.name}</p>
                                    {appt?.teacher === null && <p className="text-gray-500">Deleted User</p>}
                                    <p className="text-sm text-gray-600">{new Date(appt.date).toLocaleString()}</p>
                                    <p className="text-sm">{appt.purpose}</p>
                                </div>
                                <span
                                    className={`text-sm px-2 py-1 rounded ${appt.status === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : appt.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {appt.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
