"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import ApplyAdvanceModal from "@/components/ApplyAdvanceModal";
import { useRequestMutation, useGetRequests } from "../service/authService";

type Status = "pending" | "approved" | "rejected";

interface Advance {
  id: string;
  date: string;
  billNo: string;
  advanceFromCompany: number;
  amount: number;
  remarks: string;
  status: Status;
}

function Badge({ status }: { status: Status }) {
  const map = {
    pending: { bg: "#fefce8", c: "#a16207", dot: "#eab308", t: "Pending" },
    approved: { bg: "#f0fdf4", c: "#15803d", dot: "#22c55e", t: "Approved" },
    rejected: { bg: "#fef2f2", c: "#b91c1c", dot: "#ef4444", t: "Rejected" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.c }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: s.dot }}
      />
      {s.t}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 animate-fade-in">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: color + "22" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [modal, setModal] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [filter, setFilter] = useState<"all" | Status>("all");


  // 1. Access the Redux Data here!
  const authData = useSelector((state: any) => state.auth);

  // 2. You can use authData.employeeId, authData.role, or authData.total
  // Here, we fallback to Redux if the URL parameter is missing.
  const activeEmployee = authData.employeeId || "";
  console.log("activeEmployee", authData);

  const { mutate, isPending } = useRequestMutation();
  const { data, isLoading } = useGetRequests(activeEmployee);

  const handleApply = (d: {
    date: string;
    billNo: string;
    salary: string;
    amount: string;
    remarks: string;
  }) => {
    mutate(
      {
        employeeID: activeEmployee, // Dynamic active ID
        date: d.date,
        bill_no: d.billNo,
        amount: Number(d.amount),
        remark: d.remarks,
        total: Number(authData.total),
        net_payable: Math.max(0, Number(authData.total) - Number(d.amount)),
        name: authData.name,
      },
      {
        onSuccess: () => {
          setModal(false);
          alert("Application successfully submitted to the backend!");
        },
        onError: (err: any) => {
          console.error("Submission error:", err);
          alert(
            "Failed to submit: " + (err.response?.data?.message || err.message),
          );
        },
      },
    );
  };

  // Map MongoDB fields to the original frontend format
  const requestsList = Array.isArray(data)
    ? data.map((d: any) => ({
        id: d._id || d.id,
        date: d.date,
        billNo: d.bill_no || d.billNo,
        advanceFromCompany: d.advanceFromCompany || 0,
        amount: d.amount || 0,
        remarks: d.remark || d.remarks,
        status: d.status || "pending",
        // Use the total from Redux if it's not present on the document
        total: Number(authData.total) || 0,
      }))
    : advances;

  const filtered =
    filter === "all"
      ? requestsList
      : requestsList.filter((a: any) => a.status === filter);
  const pending = requestsList.filter(
    (a: any) => a.status === "pending",
  ).length;
  const approved = requestsList.filter(
    (a: any) => a.status === "approved",
  ).length;
  const totalAmt = requestsList
    .filter((a: any) => a.status === "approved")
    .reduce((s: number, a: any) => s + (a.amount || 0), 0);

  const FILTERS = ["all", "pending", "approved", "rejected"] as const;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f1f5f9" }}
    >
      <Sidebar
        role="employee"
        isOpen={sidebar}
        onClose={() => setSidebar(false)}
      />

      <div className="flex-1 flex flex-col min-h-0 lg:ml-64">
        <Navbar
          title="Advance Management"
          role="employee"
          onMenuClick={() => setSidebar(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Greeting */}
          <div className="mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">
              Good morning, {authData.name ? authData.name.split(" ")[0] : "User"}! 👋
            </h2>
            <p className="text-slate-500 mt-1">
              Track and manage your advance applications.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
            <StatCard
              label="Total Advances"
              value={requestsList.length}
              icon="📋"
              color="#7c3aed"
            />
            <StatCard
              label="Pending"
              value={pending}
              sub="Awaiting approval"
              icon="⏳"
              color="#f59e0b"
            />
            <StatCard
              label="Approved"
              value={approved}
              sub="Processed"
              icon="✅"
              color="#10b981"
            />
            <StatCard
              label="Total Received"
              value={`₹${totalAmt.toLocaleString("en-IN")}`}
              icon="💰"
              color="#3b82f6"
            />
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 gap-3">
              <h3 className="text-base font-bold text-slate-800">
                My Advance Applications
              </h3>
              <button
                onClick={() => setModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                }}
              >
                + Apply for Advance
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-5 py-3 border-b border-slate-100 overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer whitespace-nowrap ${filter === f ? "text-white" : "text-slate-500 hover:bg-slate-100"}`}
                  style={
                    filter === f
                      ? {
                          background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                        }
                      : {}
                  }
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}{" "}
                  (
                  {f === "all"
                    ? requestsList.length
                    : requestsList.filter((a: any) => a.status === f).length}
                  )
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "Name",
                      "Date",
                      "Bill No",
                      "Salary",
                      "Amount",
                      "Net Payable",
                      "Remarks",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-12 text-slate-400 text-sm"
                      >
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(( a: any) => (
                      <tr
                        key={a.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                              }}
                            >
                              {(authData.name || "U")[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-800 whitespace-nowrap">
                              {authData.name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {new Date(a.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                          {a.billNo}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">
                          ₹{a.total.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-800">
                          ₹{a.amount.toLocaleString("en-IN")}
                        </td>
                        <td
                          className="px-4 py-3.5 text-sm font-semibold"
                          style={{ color: "#7c3aed" }}
                        >
                          ₹
                          {Math.max(0, a.total - a.amount).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 max-w-[140px] truncate">
                          {a.remarks || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge status={a.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <ApplyAdvanceModal
        isOpen={modal}
        onClose={() => setModal(false)}
        onSubmit={handleApply}
        data={authData.total}
      />
    </div>
  );
}
