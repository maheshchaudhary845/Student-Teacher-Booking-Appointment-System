"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);

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
    };

    if (!user) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            {appointments.length === 0 && <p>No appointments found.</p>}

            {appointments.map((a) => (
                <div
                    key={a._id}
                    className="border p-4 mb-3 rounded bg-white flex justify-between items-center"
                >
                    <div>
                        <p><strong>Student:</strong> {a.student?.name || "N/A"}</p>
                        <p><strong>Teacher:</strong> {a.teacher?.name || "N/A"}</p>
                        <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                        <p><strong>Purpose:</strong> {a.purpose}</p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    a.status === "approved"
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
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => updateStatus(a._id, "cancelled")}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
