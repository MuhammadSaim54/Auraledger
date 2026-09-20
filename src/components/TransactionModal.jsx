import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Building2, ShieldCheck, Sparkles, Check, Tag } from "lucide-react";
import { CURRENCIES, CATEGORIES } from "../types/models";

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  currentCurrency = "USD"
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("groceries");
  const [vaultId, setVaultId] = useState("primary");
  const [tag, setTag] = useState("#general");

  if (!isOpen) return null;

  const activeCurrencyMeta = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawVal = parseFloat(amount);
    if (!rawVal || rawVal <= 0) return;

    // Convert active currency amount back to base USD for consistent ledger storage
    const baseUsdAmount = rawVal / (activeCurrencyMeta.rate || 1);

    onSubmit({
      id: "tx-" + Date.now(),
      title: title.trim(),
      merchant: title.trim(),
      category,
      type,
      amount: Math.round(baseUsdAmount * 100) / 100, // stored normalized in USD
      vaultId,
      account: vaultId === "reserve" ? "Emergency Reserve" : vaultId === "growth" ? "Growth & Lab" : "Primary Vault",
      date: new Date().toISOString().split("T")[0],
      tag: tag.startsWith("#") ? tag : `#${tag}`,
      currencyEntered: currentCurrency,
      originalAmount: rawVal
    });

    onClose();
    setTitle("");
    setAmount("");
    setType("expense");
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[500px] bg-white border border-stone-200/90 rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] p-6 sm:p-7 z-10 select-none my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
                Ledger Ingestion
              </span>
              <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-950 mt-0.5">
                Record Capital Flow
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-mono">
            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-stone-100/80 border border-stone-200/70">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  type === "expense" ? "bg-white text-zinc-950 shadow-xs" : "text-stone-500 hover:text-zinc-900"
                }`}
              >
                Outflow (Expense)
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  type === "income" ? "bg-white text-emerald-600 shadow-xs" : "text-stone-500 hover:text-zinc-900"
                }`}
              >
                Inflow (Income)
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                Transaction Descriptor
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Cloud GPU Cluster"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xs font-sans font-medium text-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Amount with Active Currency Indicator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-stone-400">
                  Amount in {currentCurrency}
                </label>
                {currentCurrency !== "USD" && (
                  <span className="text-[9px] text-stone-400">
                    FX: 1 USD = {activeCurrencyMeta.symbol}{activeCurrencyMeta.rate}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-stone-400">
                  {activeCurrencyMeta.symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xl font-black text-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Category & Vault Partition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-orange-500 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Target Vault
                </label>
                <select
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="primary">Primary Operating (50%)</option>
                  <option value="reserve">Emergency Reserve (30%)</option>
                  <option value="growth">Growth & Lab (20%)</option>
                </select>
              </div>
            </div>

            {/* Tag */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                Audit Tag
              </label>
              <input
                type="text"
                placeholder="#infra"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xs font-medium text-zinc-950 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>Ingest Flow</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}