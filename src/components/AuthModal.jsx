import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Wallet, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  LogIn,
  UserPlus,
  X
} from "lucide-react";
import { CURRENCIES } from "../types/models";

// Har device/mobile browser par pehle se verified account
const SEED_USER = {
  id: "usr_primary_saim",
  name: "Muhammad Saim",
  email: "skystarkrk@gmail.com",
  password: "password123",
  phone: "+92 300 1234567",
  startingBalance: 200000,
  currency: "USD",
  createdAt: new Date().toISOString()
};

export default function AuthModal({ initialMode = "signin", onAuthSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "Muhammad Saim",
    email: "skystarkrk@gmail.com",
    password: "password123",
    phone: "+92 300 1234567",
    startingBalance: "200000",
    currency: "USD"
  });

  // Ensure default account exists across all mobile & desktop browsers
  useEffect(() => {
    try {
      const existing = localStorage.getItem("auraledger_users");
      let users = existing ? JSON.parse(existing) : [];
      if (!users.some((u) => u.email.toLowerCase() === SEED_USER.email.toLowerCase())) {
        users.push(SEED_USER);
        localStorage.setItem("auraledger_users", JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const emailClean = form.email.trim().toLowerCase();
    const passwordClean = form.password;
    const existingUsers = JSON.parse(localStorage.getItem("auraledger_users") || "[]");

    if (mode === "signin") {
      if (!emailClean || !passwordClean) {
        setErrorMessage("Please enter both email and password.");
        return;
      }

      const foundUser = existingUsers.find(
        (u) => u.email.toLowerCase() === emailClean && u.password === passwordClean
      );

      if (!foundUser) {
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      localStorage.setItem("auraledger_active_user_id", foundUser.id);
      onAuthSuccess(foundUser);

    } else {
      if (!form.name.trim()) {
        setErrorMessage("Full legal name is required.");
        return;
      }
      if (!emailClean || !emailClean.includes("@")) {
        setErrorMessage("Please enter a valid work email address.");
        return;
      }
      if (!passwordClean || passwordClean.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (!form.phone.trim()) {
        setErrorMessage("Phone number is required for transaction alerts.");
        return;
      }

      const userExists = existingUsers.some((u) => u.email.toLowerCase() === emailClean);
      if (userExists) {
        setErrorMessage("An account with this email already exists. Please Sign In.");
        return;
      }

      const newUserId = "usr_" + Date.now();
      const newUser = {
        id: newUserId,
        name: form.name.trim(),
        email: emailClean,
        password: passwordClean,
        phone: form.phone.trim(),
        startingBalance: Number(form.startingBalance) || 0,
        currency: form.currency || "USD",
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem("auraledger_users", JSON.stringify(existingUsers));

      const initialUserData = {
        transactions: [
          {
            id: `tx-${Date.now()}-1`,
            title: "Initial Balance Provision",
            merchant: "Central Vault",
            category: "freelance",
            type: "income",
            amount: Number(form.startingBalance) || 0,
            status: "Completed",
            account: "Primary Vault",
            date: new Date().toISOString().split("T")[0],
            tag: "#initial"
          }
        ],
        vaults: [
          { id: `v-${Date.now()}-1`, name: "Emergency Reserve", target: 10000, current: 2500, icon: "ShieldCheck" },
          { id: `v-${Date.now()}-2`, name: "Future Growth Fund", target: 30000, current: 7800, icon: "TrendingUp" }
        ]
      };
      localStorage.setItem(`auraledger_data_${newUserId}`, JSON.stringify(initialUserData));
      localStorage.setItem("auraledger_active_user_id", newUserId);
      onAuthSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#ffffff] rounded-3xl border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden my-auto"
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-zinc-500 hover:text-zinc-900 transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Scrollable Wrapper */}
        <div className="overflow-y-auto no-scrollbar">
          
          {/* Header Bar */}
          <div className="px-5 sm:px-8 pt-6 pb-4 sm:pb-5 bg-gradient-to-b from-stone-50 to-white border-b border-stone-100">
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-orange-500/10 text-orange-700 border border-orange-500/20">
                <Sparkles className="w-3 h-3 text-orange-600" />
                <span>Multi-Tenant Vault Access</span>
              </div>

              <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-stone-100 border border-stone-200/80">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setErrorMessage(""); }}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    mode === "signin" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setErrorMessage(""); }}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    mode === "signup" ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Register</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
              {mode === "signin" ? "Unlock Your Personal Vault" : "Create New Identity"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {mode === "signin" 
                ? "Enter your credentials to load your isolated transactions and liquidity data." 
                : "Set up a clean financial ledger. All transactions remain securely partitioned."}
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-5 sm:py-6 space-y-3 sm:space-y-3.5" autoComplete="on">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-mono font-medium">
                {errorMessage}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-[11px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Saim Khan"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-medium focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="skystarkrk@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-mono font-medium focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-mono font-medium focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-[11px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-mono font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                      Opening Liquidity
                    </label>
                    <div className="relative">
                      <Wallet className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={form.startingBalance}
                        onChange={(e) => handleInputChange("startingBalance", e.target.value)}
                        placeholder="5000"
                        className="w-full pl-9 pr-2.5 py-2.5 rounded-xl border border-stone-200 focus:border-zinc-950 bg-stone-50/50 text-xs font-mono font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-mono font-medium text-zinc-700 mb-1">
                      Base Currency
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono font-semibold focus:outline-none cursor-pointer"
                    >
                      {Object.keys(CURRENCIES).map((c) => (
                        <option key={c} value={c}>
                          {c} ({CURRENCIES[c].symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Isolated Local Storage</span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>{mode === "signin" ? "Sign In" : "Complete & Enter"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
}