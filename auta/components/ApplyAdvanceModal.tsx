"use client";
import { useState } from "react";

interface AdvanceFormData {
  date: string;
  billNo: string;
  description: string;
  salary: string;
  amount: string;
  remarks: string;
}

interface ApplyAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdvanceFormData) => void;
  data: string;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition text-sm";
const inputStyle = { background: "#f8fafc" };

export default function ApplyAdvanceModal({
  isOpen,
  onClose,
  onSubmit,
  data,
}: ApplyAdvanceModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<AdvanceFormData>({
    date: today,
    billNo: "",
    description: "",
    salary: "",
    amount: "",
    remarks: "",
  });

  if (!isOpen) return null;

  const set =
    (key: keyof AdvanceFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      date: today,
      billNo: "",
      description: "",
      salary: "",
      amount: "",
      remarks: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-slate-100"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">Apply for Advance</h2>
            <p className="text-xs mt-0.5" style={{ color: "#c4b5fd" }}>
              Fill in all required details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {/* Row 1: Date + Bill No */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bill No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.billNo}
                onChange={set("billNo")}
                required
                placeholder="e.g. BILL-001"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={set("description")}
              required
              placeholder="Brief description of the advance reason"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Row 2: Salary + Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Salary (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={data}
                readOnly
                disabled
                className={`${inputClass} cursor-not-allowed`}
                style={{ background: "#e2e8f0", color: "#475569", fontWeight: "bold" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={set("amount")}
                required
                placeholder="0"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Remarks
            </label>
            <textarea
              value={form.remarks}
              onChange={set("remarks")}
              rows={3}
              placeholder="Any additional remarks..."
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>

          {/* Net Payable (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Net Payable (₹)
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={Math.max(0, Number(data) - Number(form.amount))}
              className={`${inputClass} cursor-not-allowed`}
              style={{ background: "#e2e8f0", color: "#475569", fontWeight: "bold" }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
