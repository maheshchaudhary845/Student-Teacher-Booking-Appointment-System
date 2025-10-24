"use client";
import { useEffect, useState } from "react";

export default function TeacherDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch teacher appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", { credentials: "include" });
      const data = await res.json();

      setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update appointment status
  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
      } else {
        fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading appointments...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center">No appointments yet.</p>
      ) : (
        <ul className="space-y-3 max-w-4xl mx-auto">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white shadow"
            >
              <div>
                <p className="font-semibold text-lg">
                  {appt.student?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(appt.date).toLocaleString()}
                </p>
                <p className="text-sm">{appt.purpose}</p>
              </div>

              <div className="flex items-center gap-2">
                {appt.status === "pending" ? (
                  <>
                    <button
                      onClick={() => updateStatus(appt._id, "approved")}
                      disabled={updating}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(appt._id, "cancelled")}
                      disabled={updating}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      appt.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
