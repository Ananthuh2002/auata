"use client";
import { useSelector } from "react-redux";

interface NavbarProps {
  title: string;
  role: "employee" | "admin";
  onMenuClick: () => void;
}

export default function Navbar({ title, role, onMenuClick }: NavbarProps) {
  const authData = useSelector((state: any) => state.auth);
  const userName = authData?.name || (role === "admin" ? "Admin User" : "Employee");
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white"
      style={{ borderColor: "#e2e8f0" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#7c3aed" }}
          />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            {userInitials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {userName}
            </p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
