"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function TeachersPage() {
  const { user } = useUser();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/users?role=teacher", { credentials: "include" });
        const data = await res.json();
        setTeachers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Admin: delete teacher
  const deleteTeacher = async (id) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setTeachers(teachers.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete teacher", err);
    }
  };

  // Student: book appointment
  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !date || !purpose) return alert("Fill all fields!");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          teacherId: selectedTeacher._id,
          date,
          purpose,
        }),
      });

      if (res.ok) {
        alert("Appointment booked successfully!");
        setSelectedTeacher(null);
        setDate("");
        setPurpose("");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Failed to book appointment", err);
    }
  };

  if (loading) return <p className="p-6">Loading teachers...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teachers</h1>
      {teachers.length === 0 && <p>No teachers found.</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg">{t.name}</h2>
            <p className="text-sm text-gray-600">{t.email}</p>
            <p className="text-sm">{t.department}</p>
            <p className="text-sm">{t.subject}</p>

            {user?.role === "admin" && (
              <div className="flex mt-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => alert("Edit teacher functionality")}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => deleteTeacher(t._id)}
                >
                  Delete
                </button>
              </div>
            )}

            {user?.role === "student" && (
              <button
                className={`mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition ${
                  selectedTeacher?._id === t._id ? "bg-blue-800" : ""
                }`}
                onClick={() => setSelectedTeacher(t)}
              >
                {selectedTeacher?._id === t._id ? "Selected" : "Select Teacher"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Student Booking Form */}
      {user?.role === "student" && selectedTeacher && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow max-w-md">
          <h2 className="font-semibold text-lg mb-2">
            Book appointment with {selectedTeacher.name}
          </h2>
          <form onSubmit={bookAppointment} className="space-y-3">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={() => setSelectedTeacher(null)}
              className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
