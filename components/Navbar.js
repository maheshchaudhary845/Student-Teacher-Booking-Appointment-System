"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function Navbar() {
  const { user, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const pathname = usePathname();
  const { refreshUser } = useUser()

  const hiddenPaths = ["/login", "/register"];
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Appointments", path: "/appointments" },
    { name: "Teachers", path: "/teachers", roles: ["student", "admin"] },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      await refreshUser()
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (path) =>
    pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "hover:text-blue-600";

  if (hiddenPaths.includes(pathname)) return null;

  if (loading) {
    return (
      <nav className="bg-sky-100 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-600 cursor-pointer">
          Student-Teacher Booking
        </div>
        <p className="text-gray-500">Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="bg-sky-100 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div
        onClick={() => router.push("/dashboard")}
        className="lg:text-lg text-sm lg:font-bold font-semibold cursor-pointer"
      >
        <div className="flex items-center gap-2 bg-[#6597d0] hover:bg-[#5a8fcc] border border-white p-1 rounded-lg shadow-md hover:shadow-lg">
          <img src="/appointment.png" className="lg:w-8 lg:h-8 w-7 h-7" alt="appointment logo" />
          <span className="text-white">Student-Teacher Booking</span>
        </div>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex space-x-6">
        {links.map((link) => {
          if (link.roles && !link.roles.includes(user?.role)) return null;
          return (
            <button
              key={link.path}
              onClick={() => router.push(link.path)}
              className={linkClass(link.path)}
            >
              {link.name}
            </button>
          );
        })}
      </div>

      {/* User menu */}
      <div ref={menuRef} className="hidden md:block relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center space-x-2 bg-[#696FC7] px-3 py-1 rounded-full hover:bg-[#535abe] transition"
        >
          <span className="text-white">{user?.name}</span>
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || "U"}&background=random`}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="px-4 py-2 bg-[#758A93] rounded-t-lg text-gray-700 border-b">
              <p className="font-semibold text-[#ffffff]">{user.name}</p>
              <p className="text-sm text-gray-100">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
            <button
              onClick={() => {
                router.push("/profile");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={() => {
                router.push("/settings");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:rounded-b-lg text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileOpen((prev) => !prev)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden z-40">
          {links.map((link) => {
            if (link.roles && !link.roles.includes(user?.role)) return null;
            return (
              <button
                key={link.path}
                onClick={() => {
                  router.push(link.path);
                  setMobileOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 text-left"
              >
                {link.name}
              </button>
            );
          })}

          <div className="border-t my-2" />

          <button
            onClick={() => {
              router.push("/profile");
              setMobileOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 text-left"
          >
            Profile
          </button>
          <button
            onClick={() => {
              router.push("/settings");
              setMobileOpen(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 text-left"
          >
            Settings
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
