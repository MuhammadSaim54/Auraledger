import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Mail, Phone, Wallet, ShieldCheck } from "lucide-react";
import { CURRENCIES } from "../types/models";

export default function OnboardingModal({ onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startingBalance: "5000",
    currency: "USD"
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (isNaN(Number(formData.startingBalance)) || Number(formData.startingBalance) < 0) {
      newErrors.startingBalance = "Valid balance is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete({
      ...formData,
      startingBalance: Number(formData.startingBalance),
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#ffffff] rounded-3xl border border-stone-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.2)] overflow-hidden"
      >
        {/* Modal Header Ambient Bar */}
        <div className="relative px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-b from-stone-50 to-white border-b border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-orange-500/10 text-orange-700 border border-orange-500/20">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Identity Verification & Provisioning</span>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Step 1 of 1</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-zinc-900">
            Initialize Your Ledger
          </h2>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Configure your multi-currency identity. All telemetry stays locally stored and encrypted in your browser cache.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
              Legal Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholder="e.g. Saim Khan"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                  errors.name ? "border-rose-400 bg-rose-50/20" : "border-stone-200 focus:border-zinc-950 bg-stone-50/50"
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="saim@tech.io"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                    errors.email ? "border-rose-400 bg-rose-50/20" : "border-stone-200 focus:border-zinc-950 bg-stone-50/50"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  placeholder="+92 300 1234567"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                    errors.phone ? "border-rose-400 bg-rose-50/20" : "border-stone-200 focus:border-zinc-950 bg-stone-50/50"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Initial Liquidity & Preferred Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
                Starting Net Balance
              </label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  value={formData.startingBalance}
                  onChange={(e) => {
                    setFormData({ ...formData, startingBalance: e.target.value });
                    if (errors.startingBalance) setErrors({ ...errors, startingBalance: null });
                  }}
                  placeholder="5000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-mono font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
                Base Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono font-semibold focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCIES[c].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>End-to-End Local Vault</span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}