"use client";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">👤 My Profile</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition">
        <div className="flex items-center space-x-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true`}
            alt="profile"
            className="w-16 h-16 rounded-full shadow"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.department && (
            <p>
              <strong>Department:</strong> {user.department}
            </p>
          )}
          {user.subject && (
            <p>
              <strong>Subject:</strong> {user.subject}
            </p>
          )}
        </div>

        <button
          onClick={() => window.location.href = "/settings"}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
