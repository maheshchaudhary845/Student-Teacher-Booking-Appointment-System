"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", subject: "" });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add / Update teacher
  const handleSaveTeacher = async () => {
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/admin/teachers/${editingId}` : "/api/admin/teachers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert(data.message);
      setForm({ name: "", email: "", password: "", department: "", subject: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Teacher
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Approve Student
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/students/${id}/approve`, { method: "PATCH", credentials: "include" });
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit teacher
  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      department: user.department || "",
      subject: user.subject || "",
    });
    setEditingId(user._id);
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  // Dashboard
  const teachersCount = users.filter(u => u.role === "teacher").length;
  const studentsCount = users.filter(u => u.role === "student").length;
  const pendingStudents = users.filter(u => u.role === "student" && !u.approved).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold mb-4">🛠 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Teachers</h3>
          <p className="text-3xl font-bold">{teachersCount}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Students</h3>
          <p className="text-3xl font-bold">{studentsCount}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold">{pendingStudents}</p>
        </div>
      </div>

      {/* Add/Edit Teacher Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? "✏️ Edit Teacher" : "➕ Add Teacher"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          {!editingId && (
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          )}
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveTeacher}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Teacher" : "Add Teacher"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", password: "", department: "", subject: "" });
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">📋 Users</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Department / Subject</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">{user.role === "teacher" ? `${user.department} / ${user.subject}` : "-"}</td>
                <td className="p-2 space-x-2">
                  {user.role === "teacher" && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.role === "student" && !user.approved && (
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
