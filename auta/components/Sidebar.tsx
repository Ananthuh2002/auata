"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const employeeLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/advances", label: "My Advances", icon: "💰" },
  { href: "/dashboard/leave", label: "Leave", icon: "📅" },
  { href: "/dashboard/attendance", label: "Attendance", icon: "✅" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/advances", label: "All Advances", icon: "💰" },
  { href: "/admin/employees", label: "Employees", icon: "👥" },
  { href: "/admin/leave", label: "Leave Requests", icon: "📅" },
  { href: "/admin/reports", label: "Reports", icon: "📊" },
];

interface SidebarProps {
  role: "employee" | "admin";
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === "admin" ? adminLinks : employeeLinks;
  const authData = useSelector((state: any) => state.auth);
  const userName = authData?.name || (role === "admin" ? "Admin User" : "Employee");
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0f172a" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            A
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Auta</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              {role === "admin" ? "Admin Panel" : "Employee Portal"}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
            style={{ color: "#475569" }}
          >
            Main Menu
          </p>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(124,58,237,0.15)" : "transparent",
                  color: active ? "#a78bfa" : "#94a3b8",
                  borderLeft: active
                    ? "3px solid #7c3aed"
                    : "3px solid transparent",
                }}
              >
                <span className="text-base w-6 text-center">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center gap-3 mb-3 p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {userName}
              </p>
              <p className="text-xs truncate" style={{ color: "#64748b" }}>
                {role === "admin" ? "admin@auta.com" : `${authData?.employeeId || 'employee'}@auta.com`}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer hover:bg-white/5"
            style={{ color: "#f87171" }}
          >
            ↩ Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
