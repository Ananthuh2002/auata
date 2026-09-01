"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useGetRequests } from "../../service/authService";

export default function ReportsPage() {
  const [sidebar, setSidebar] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const { data, isLoading } = useGetRequests();

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
        netPayable:
          d.net_payable !== undefined
            ? d.net_payable
            : Math.max(0, (d.total || 0) - (d.amount || 0)),
      }))
    : [];

  // Filter to only approved records for reports
  const approvedData = requestsList.filter((r: any) => r.status === "approved");

  // Derive unique employees and months
  const employees = Array.from(new Set(approvedData.map((r: any) => r.employee)));
  
  const getMonthStr = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // e.g. "2026-04"
  };

  const months = Array.from(new Set(approvedData.map((r: any) => getMonthStr(r.date)))).sort();

  // Apply User Filters
  const targetData = approvedData.filter((r: any) => {
    const matchEmp = selectedEmployee === "all" || r.employee === selectedEmployee;
    const matchMonth = selectedMonth === "all" || getMonthStr(r.date) === selectedMonth;
    return matchEmp && matchMonth;
  });

  const handleExportCSV = () => {
    if (targetData.length === 0) {
      alert("No approved advances available for these filters.");
      return;
    }

    const headers = [
      "Name",
      "Date",
      "Bill No",
      "Salary",
      "Amount",
      "Net Payable",
      "Remarks",
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      targetData
        .map((r: any) => {
          return [
            `"${r.employee}"`,
            new Date(r.date).toLocaleDateString("en-IN"),
            `"${r.billNo}"`,
            r.salary,
            r.amount,
            r.netPayable,
            `"${(r.remarks || "").replace(/"/g, '""')}"`,
          ].join(",");
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Custom Download Name based on filters!
    const empStr = selectedEmployee === "all" ? "AllEmployees" : selectedEmployee.replace(/\s+/g,'');
    const monthStr = selectedMonth === "all" ? "AllMonths" : selectedMonth;
    link.setAttribute(
      "download",
      `Approved_Advances_${empStr}_${monthStr}.csv`
    );
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f1f5f9" }}>
      <Sidebar role="admin" isOpen={sidebar} onClose={() => setSidebar(false)} />

      <div className="flex-1 flex flex-col min-h-0 lg:ml-64">
        <Navbar title="Reports Management" role="admin" onMenuClick={() => setSidebar(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Reports 📊</h2>
            <p className="text-slate-500 mt-1">
              Generate custom CSV reports indexed by employee and month.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center animate-fade-in max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-5">
              Advanced Report Generator
            </h3>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Months</option>
                  {months.map((m) => {
                    const [year, month] = (m as string).split("-");
                    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric"
                    });
                    return (
                      <option key={m as string} value={m as string}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Export Actions Strip */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100/50 gap-4 transition-all">
              <div>
                <p className="text-sm font-semibold text-emerald-800 mb-0.5">
                  Ready to export CSV
                </p>
                <p className="text-xs font-medium text-emerald-600/80">
                  {isLoading ? "Loading data..." : `${targetData.length} approved record(s) matched your criteria`}
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                disabled={isLoading || targetData.length === 0}
                className="flex items-center text-sm justify-center px-6 py-3 rounded-xl text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                }}
              >
                {isLoading ? "Loading Data..." : "⬇️ Download Excel/CSV"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
