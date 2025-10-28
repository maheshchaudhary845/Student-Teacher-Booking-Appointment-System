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
  const [searchQuery, setSearchQuery] = useState("")
  const [form, setForm] = useState({ name: "", email: "", department: "", subject: "" })
  const [editingId, setEditingId] = useState("")
  const [updateLoading, setUpdateLoading] = useState(false)

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
  useEffect(() => {
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

  const handleSaveTeacher = async () => {
    setUpdateLoading(true)
    try {
      const res = await fetch(`/api/admin/teachers/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      })

      const data = await res.json();
      if (!res.ok) return alert(data.message)

      setForm({ name: "", email: "", department: "", subject: "" });
      setEditingId(null);
      fetchTeachers();
    } catch (error) {
      console.error(error)
    } finally{
      setUpdateLoading(false)
    }
  }

  const editTeacher = async (t) => {
    setEditingId(t._id)
    setForm({
      name: t.name,
      email: t.email,
      department: t.department,
      subject: t.subject
    })
  }

  if (loading) return <div className='fixed inset-0 flex space-x-2 justify-center items-center'>
    <span className='sr-only'>Loading...</span>
    <div className='h-8 w-8 bg-[#A5D7E8] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
    <div className='h-8 w-8 bg-[#548fa2] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
    <div className='h-8 w-8 bg-[#115b74] rounded-full animate-bounce'></div>
  </div>

  return (
    <div className="p-6">
      <div className="flex justify-center items-center">
        <input type="search" className="border-2 border-black focus:border-sky-800 focus:outline-none max-w-sm w-full p-1 pl-2 mb-4 rounded-full" placeholder="Type to Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      {teachers.length === 0 && <p className="text-gray-700">No teachers found.</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((t) => (
            <div key={t._id} className="bg-sky-500/5 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:bg-sky-100 transform transition-all duration-200 scale-100 hover:scale-[1.02]">
              <h2 className="font-semibold text-lg">{t.name}</h2>
              <p className="text-sm text-gray-600">{t.email}</p>
              <p className="text-sm">{t.department}</p>
              <p className="text-sm">{t.subject}</p>
              {/* admin control **/}
              {user?.role === "admin" && (
                <div className="flex mt-2 space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    onClick={() => editTeacher(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={() => deleteTeacher(t._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              {/* student control */}
              {user?.role === "student" && (
                <button
                  className={`mt-2 w-full bg-[#3F72AF] text-white py-1 rounded hover:bg-[#2067be] transition ${selectedTeacher?._id === t._id ? "hover:bg-[#0056bf]" : ""
                    }`}
                  onClick={() => setSelectedTeacher(t)}
                >
                  {selectedTeacher?._id === t._id ? "Selected" : "Select Teacher"}
                </button>
              )}
            </div>
          ))}
      </div>
      {teachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && <p className="text-gray-700 text-center">No teacher found.</p>}

      {/* Student Booking Form */}
      {user?.role === "student" && selectedTeacher && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-[5px] z-50">
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-lg max-w-2xl w-full mx-4 shadow-lg p-6 space-y-4 border-2 text-center border-sky-200 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <h2 className="text-white text-shadow-md font-semibold bg-sky-500 inline-block p-1 rounded-full px-4 text-lg mb-2">
              Book appointment with {selectedTeacher.name}
            </h2>
            <form onSubmit={bookAppointment} className="space-y-3">
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e)=> e.currentTarget.showPicker()}
                required
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
              <textarea
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
              <button
                type="submit"
                className="w-full bg-[#3F72AF] text-white py-2 rounded-lg hover:bg-[#2067be]"
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
        </div>
      )}

      {/*Edit teacher */}
      {editingId && <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-[5px] z-50">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg max-w-2xl w-full mx-4 shadow-lg p-6 space-y-4 border-2 text-center border-sky-200 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <h2 className="text-xl text-white text-shadow-md font-semibold bg-sky-500 inline-block p-1 rounded-full px-4">✏️ Edit Teacher</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="border border-white/70 placeholder-gray-300 text-white rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleSaveTeacher}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {updateLoading ? "Updating..." : "Update Teacher"}
              </button>
              <button
                onClick={() => {
                  setEditingId(null)
                  setForm({ name: "", email: "", department: "", subject: "" });
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
