"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../service/authService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../feature/authSlice";
export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const router = useRouter();
  const dispatch = useDispatch();


  // ✅ Hook called at top level of component (not inside handler)
  const { mutate, isPending, isError } = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ mutate() sends { employeeId, password } as `data` to mutationFn
    mutate(
      { employeeId, password },
      {
        onSuccess: (response) => {
          const userRole = response.data.role;
          console.log("userRole", response.data);
          setRole(userRole);
          const empId = response.data.employeeId || employeeId;
          dispatch(setCredentials({ employeeId: empId, role: userRole, total: response.data.total, name: response.data.name }));
          router.push(
            userRole === "admin" ? "/admin" : `/dashboard`,
          );
        },
        onError: (error) => {
          console.log("Login error", error);
        },
      },
    );
  };

  const inputStyle: React.CSSProperties = {
    background: "#fff",
    borderColor: "#cbd5e1",
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle,#a78bfa,transparent)",
            transform: "translate(30%,-30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle,#818cf8,transparent)",
            transform: "translate(-30%,30%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            A
          </div>
          <span className="text-white text-2xl font-bold">Auta</span>
        </div>

        {/* Center */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage Advances
            <br />
            <span style={{ color: "#a78bfa" }}>Effortlessly</span>
          </h1>
          <p className="text-lg mb-8" style={{ color: "#c4b5fd" }}>
            All-in-one platform for managing employee advances, leaves, and
            attendance.
          </p>
          <div className="space-y-3">
            {[
              {
                icon: "💰",
                title: "Advance Management",
                desc: "Apply and track salary advances",
              },
              {
                icon: "📅",
                title: "Leave Management",
                desc: "Manage leave requests easily",
              },
              {
                icon: "✅",
                title: "Attendance Tracking",
                desc: "Monitor attendance records",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-xs" style={{ color: "#a5b4fc" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-sm" style={{ color: "#6d7bff" }}>
          © 2026 Auta. All rights reserved.
        </p>
      </div>

      {/* Right – Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              A
            </div>
            <span className="text-xl font-bold text-slate-800">Auta</span>
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          {/* Role toggle */}
          <div
            className="flex p-1 rounded-xl mb-6"
            style={{ background: "#e2e8f0" }}
          >
            {(["employee", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all cursor-pointer ${role === r ? "bg-white shadow-sm text-violet-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {r === "employee" ? "👤 Employee" : "🛡️ Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                placeholder={role === "admin" ? "Admin-01" : "EMP-001"}
                className="w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-all"
                style={inputStyle}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium"
                  style={{ color: "#7c3aed" }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-all"
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all mt-1 cursor-pointer disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                boxShadow: "0 4px 15px rgba(124,58,237,0.35)",
              }}
            >
              {isPending
                ? "Signing in..."
                : `Sign in as ${role === "admin" ? "Admin" : "Employee"}`}
            </button>
          </form>

          <div
            className="mt-6 p-4 rounded-xl"
            style={{ background: "#ede9fe" }}
          >
            <p className="text-xs font-bold text-violet-700 mb-1">
              Demo Credentials
            </p>
            <p className="text-xs text-violet-600">
              Employee: EMP-001 / password
            </p>
            <p className="text-xs text-violet-600">
              Admin: Admin-01 / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
