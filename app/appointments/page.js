"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                const data = await res.json();
                if (data.user) setUser(data.user);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("/api/appointments", { credentials: "include" });
                const data = await res.json();
                setAppointments(data.appointments || []);
            } catch (err) {
                console.error("Failed to fetch appointments", err);
            }
        };
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        if (status === "approved") {
            setLoadingAccept(true)
        }
        else if (status === "cancelled") {
            setLoadingCancel(true)
        }
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await fetch("/api/appointments", { credentials: "include" });
                const data = await updated.json();
                setAppointments(data.appointments || []);
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
        finally {
            setLoadingAccept(false)
            setLoadingCancel(false)
        }
    };

    if (!user) return <div className='fixed inset-0 flex space-x-2 justify-center items-center'>
        <span className='sr-only'>Loading...</span>
        <div className='h-8 w-8 bg-[#A5D7E8] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-[#548fa2] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-[#115b74] rounded-full animate-bounce'></div>
    </div>

    return (
        <div className="p-6">
            {/* <h1 className="text-2xl font-bold mb-4">Appointments</h1> */}
            {appointments.length === 0 && <p>No appointments found.</p>}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((a) => (
                    <div
                        key={a._id}
                        className="border border-black/10 p-4 mb-3 shadow-lg backdrop-blur-sm rounded bg-sky-500/5 hover:bg-sky-100 flex justify-between items-center transform transition-all duration-200 scale-100 hover:scale-[1.02]"
                    >
                        <div>
                            <p><strong>Student:</strong> {a.student?.name || "N/A"}</p>
                            <p><strong>Teacher:</strong> {a.teacher?.name || "N/A"}</p>
                            <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                            <p><strong>Purpose:</strong> {a.purpose}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded text-sm ${a.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : a.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {a.status}
                                </span>
                            </p>
                        </div>

                        {(user.role === "teacher" || user.role === "admin") && a.status === "pending" && (
                            <div className="space-x-2">
                                <button
                                    onClick={() => updateStatus(a._id, "approved")}
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-3 py-1 rounded text-sm"
                                >
                                    {loadingAccept ? "Accepting..." : "Accept"}
                                </button>
                                <button
                                    onClick={() => updateStatus(a._id, "cancelled")}
                                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-1 rounded text-sm"
                                >
                                    {loadingCancel ? "Cancelling..." : "Cancel"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
