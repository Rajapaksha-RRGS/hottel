'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Users, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { get } from "node:http";
import { useEffect } from "react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Waiter" | "Receptionist" | "Manager";
  createdAt: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Waiter" | "Receptionist" | "Manager";
}

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

export default function StaffManagement() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "Waiter",
  });

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getStaffList();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return false;
    }
    if (!formData.email.includes("@")) {
      showToast("Valid email is required", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/register-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register staff");
      }

      showToast(`✓ ${formData.name} registered successfully!`, "success");

      // Add to local list
      getStaffList();

      // Reset form
      setFormData({ name: "", email: "", password: "", role: "Waiter" });
      setShowForm(false);
    } catch (error: any) {
      showToast(error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStaffList = async () => {
    try {
      const response = await fetch("/api/register-staff");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch staff list");
      }
      setStaffList(data.staff);
      console.log("Fetched staff list:", data.staff);
    } catch (error: any) {
      showToast(
        error.message || "An error occurred while fetching staff",
        "error",
      );
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
      case "Waiter":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
      case "Receptionist":
        return "bg-green-500/10 text-green-400 border border-green-500/30";
      case "Manager":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 space-y-3 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm border pointer-events-auto ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </div>

      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            Staff Management
          </h3>
          <p className="text-slate-400 text-sm">
            Register and manage hotel staff members
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200"
        >
          <UserPlus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Wick"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@hotel.com"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register Staff
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Staff List */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          <h4 className="text-lg font-semibold text-white">
            Staff Members ({staffList.length})
          </h4>
        </div>

        {staffList.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400">No staff members registered yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Click "Add Staff" to register your first team member
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{staff.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        {staff.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          staff.role,
                        )}`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm">
                        {staff.createdAt}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
