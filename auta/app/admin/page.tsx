"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useGetRequests, useUpdateStatus } from "../service/authService";

type Status = "pending" | "approved" | "rejected";

interface AdvanceRequest {
  id: string;
  employee: string;
  dept: string;
  date: string;
  billNo: string;
  description: string;
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

export default function AdminPage() {
  const [sidebar, setSidebar] = useState(false);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const { data, isLoading, refetch } = useGetRequests();
  const { mutateAsync: updateStatus } = useUpdateStatus();

  const updateRequest = (id: string, status: Status) => {
    updateStatus(
      { id, status },
      {
        onSuccess: (res) => {
          console.log(res);
          refetch();
        },
      },
    );
  };

  // Map incoming MongoDB fields securely
  const requestsList = Array.isArray(data)
    ? data.map((d: any) => ({
        id: d._id || d.id,
        employee: d.name || (d.employeeID ? `EMP ${d.employeeID}` : "Unknown"),
        dept: "Internal",
        date: d.date,
        billNo: d.bill_no || d.billNo,
        description: "Advance Request",
        advanceFromCompany: d.advanceFromCompany || 0,
        amount: d.amount || 0,
        remarks: d.remark || d.remarks,
        status: d.status || "pending",
        salary: d.total || 0,
        netPayable: d.net_payable !== undefined ? d.net_payable : Math.max(0, (d.total || 0) - (d.amount || 0)),
      }))
    : [];


  const filtered =
    filter === "all"
      ? requestsList
      : requestsList.filter((r: any) => r.status === filter);
  const pending = requestsList.filter(
    (r: any) => r.status === "pending",
  ).length;
  const approved = requestsList.filter(
    (r: any) => r.status === "approved",
  ).length;
  const rejected = requestsList.filter(
    (r: any) => r.status === "rejected",
  ).length;
  const disbursed = requestsList
    .filter((r: any) => r.status === "approved")
    .reduce((s: number, r: any) => s + (r.amount || 0), 0);
  const pendingAmt = requestsList
    .filter((r: any) => r.status === "pending")
    .reduce((s: number, r: any) => s + (r.amount || 0), 0);

  const FILTERS = ["all", "pending", "approved", "rejected"] as const;
  const HEADERS = [
    "Name",
    "Date",
    "Bill No",
    "Salary",
    "Amount",
    "Net Payable",
    "Remarks",
    "Status",
    "Actions",
  ];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f1f5f9" }}
    >
      <Sidebar
        role="admin"
        isOpen={sidebar}
        onClose={() => setSidebar(false)}
      />

      <div className="flex-1 flex flex-col min-h-0 lg:ml-64">
        <Navbar
          title="Advance Management"
          role="admin"
          onMenuClick={() => setSidebar(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">
              Advance Requests 🛡️
            </h2>
            <p className="text-slate-500 mt-1">
              Review and approve employee advance applications.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
            <StatCard
              label="Total Requests"
              value={requestsList.length}
              icon="📋"
              color="#7c3aed"
            />
            <StatCard
              label="Pending"
              value={pending}
              sub="Awaiting action"
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
              label="Rejected"
              value={rejected}
              icon="❌"
              color="#ef4444"
            />
          </div>

          {/* Amount summary */}
          <div className="bg-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-100 shadow-sm animate-fade-in">
            <div>
              <p className="text-sm text-slate-500">Total Disbursed</p>
              <p
                className="text-3xl font-bold mt-0.5"
                style={{ color: "#15803d" }}
              >
                ₹{disbursed.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-slate-500">Pending Amount</p>
              <p className="text-2xl font-bold text-amber-600">
                ₹{pendingAmt.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                All Advance Applications
              </h3>
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
                    : requestsList.filter((r: any) => r.status === f).length}
                  )
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {HEADERS.map((h) => (
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
                        colSpan={HEADERS.length}
                        className="text-center py-12 text-slate-400 text-sm"
                      >
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg,#7c3aed,#4f46e5)",
                              }}
                            >
                              {r.employee
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <span className="text-sm font-medium text-slate-800 whitespace-nowrap">
                              {r.employee}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {new Date(r.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                          {r.billNo}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">
                          ₹{(r.salary || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-800">
                          ₹{(r.amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td
                          className="px-4 py-3.5 text-sm font-semibold"
                          style={{ color: "#7c3aed" }}
                        >
                          ₹{(r.netPayable || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 max-w-[120px] truncate">
                          {r.remarks || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge status={r.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          {r.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateRequest(r.id, "approved")}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition"
                                style={{ background: "#10b981" }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateRequest(r.id, "rejected")}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition"
                                style={{ background: "#ef4444" }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              —
                            </span>
                          )}
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
    </div>
  );
}
