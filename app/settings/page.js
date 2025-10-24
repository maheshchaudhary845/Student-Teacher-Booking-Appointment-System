"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // update profile
  const handleProfileSave = async () => {
    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        alert("Profile updated ✅");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  // To change password
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully ✅");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Password change failed", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-2 text-blue-600">⚙️ Settings</h1>
      <p className="text-gray-500 mb-6">
        Manage your profile and security settings below.
      </p>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">👤 Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">🔒 Change Password</h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded px-3 py-2"
            value={passwords.current}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, current: e.target.value }))
            }
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded px-3 py-2"
            value={passwords.new}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, new: e.target.value }))
            }
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border rounded px-3 py-2"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
            }
          />
          <button
            onClick={handlePasswordChange}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
