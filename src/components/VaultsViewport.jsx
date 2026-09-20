import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vault,
  ArrowRightLeft,
  ShieldCheck,
  TrendingUp,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import BotanicalCradle from "./BotanicalCradle";

const VAULT_METAS = [
  {
    id: "primary",
    name: "Primary Operating",
    description: "Daily active operational expenditures & burn liquidity",
    targetRatio: 50,
    color: "#ea580c",
    bgTint: "bg-orange-500/10",
    borderTint: "border-orange-500/30",
    textTint: "text-orange-700",
    icon: Vault
  },
  {
    id: "reserve",
    name: "Tax & Runway Reserve",
    description: "Cold-storage emergency runway & protected liability vault",
    targetRatio: 30,
    color: "#059669",
    bgTint: "bg-emerald-500/10",
    borderTint: "border-emerald-500/30",
    textTint: "text-emerald-700",
    icon: Lock
  },
  {
    id: "growth",
    name: "Growth & R&D Capital",
    description: "Discretionary tactical ventures, compute cluster & tools",
    targetRatio: 20,
    color: "#d97706",
    bgTint: "bg-amber-500/10",
    borderTint: "border-amber-500/30",
    textTint: "text-amber-700",
    icon: TrendingUp
  }
];

export default function VaultsViewport({
  vaultBalances = { primary: 0, reserve: 0, growth: 0 },
  totalLiquidity = 0,
  onExecuteTransfer,
  transferHistory = [],
  currentCurrency = "USD"
}) {
  const [sourceVault, setSourceVault] = useState("primary");
  const [targetVault, setTargetVault] = useState("reserve");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const vaultStats = useMemo(() => {
    return VAULT_METAS.map((v) => {
      const balance = Number(vaultBalances[v.id]) || 0;
      const actualRatio = totalLiquidity > 0 ? (balance / totalLiquidity) * 100 : 0;
      const targetBalance = totalLiquidity * (v.targetRatio / 100);
      const delta = balance - targetBalance;

      return {
        ...v,
        balance,
        actualRatio,
        targetBalance,
        delta
      };
    });
  }, [vaultBalances, totalLiquidity]);

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);

    if (sourceVault === targetVault) {
      showFeedback("error", "Source and Target vaults cannot be identical.");
      return;
    }

    if (!amt || amt <= 0) {
      showFeedback("error", "Please provide a valid transfer amount.");
      return;
    }

    const available = vaultBalances[sourceVault] || 0;
    if (amt > available) {
      showFeedback("error", `Insufficient liquidity in ${sourceVault}. Available: ${formatCurrency(available, currentCurrency)}`);
      return;
    }

    if (onExecuteTransfer) {
      onExecuteTransfer({
        id: `tr_${Date.now()}`,
        amount: amt,
        sourceVault,
        targetVault,
        note: transferNote.trim() || "Partition re-allocation",
        date: new Date().toISOString()
      });

      showFeedback("success", `Transferred ${formatCurrency(amt, currentCurrency)} to ${targetVault}.`);
      setTransferAmount("");
      setTransferNote("");
    }
  };

  const handleAutoRebalance = () => {
    const primaryDelta = vaultStats.find((v) => v.id === "primary")?.delta || 0;

    if (Math.abs(primaryDelta) < 10) {
      showFeedback("success", "Vaults are already in target equilibrium.");
      return;
    }

    vaultStats.forEach((v) => {
      if (v.id !== "primary" && v.delta < 0 && onExecuteTransfer) {
        const transferNeeded = Math.min(Math.abs(v.delta), Math.max(0, vaultBalances.primary));
        if (transferNeeded > 5) {
          onExecuteTransfer({
            id: `rebalance_${Date.now()}_${v.id}`,
            amount: Math.round(transferNeeded),
            sourceVault: "primary",
            targetVault: v.id,
            note: "Autonomous Equilibrium Alignment",
            date: new Date().toISOString()
          });
        }
      }
    });

    showFeedback("success", "Automated equilibrium rebalancing executed.");
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 w-full max-w-full overflow-hidden">
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 sm:right-6 z-[150] px-4 py-2.5 rounded-2xl text-xs font-mono shadow-2xl border flex items-center gap-2 max-w-[90vw] ${
              feedback.type === "error"
                ? "bg-rose-950 text-white border-rose-800"
                : "bg-zinc-950 text-white border-white/20"
            }`}
          >
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{feedback.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & Rebalance Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[28px] bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
            Liquidity Partitions
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-950">
            Multi-Vault Kinetic Engine
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            100% Client-Side Isolated Balances • 50/30/20 Target Allocation
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={handleAutoRebalance}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all relative overflow-hidden"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>Equilibrium Rebalance</span>
        </motion.button>
      </div>

      {/* 2. Top Vault Monoliths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {vaultStats.map((vault) => {
          const Icon = vault.icon;
          const isOverTarget = vault.delta >= 0;

          return (
            <motion.div
              key={vault.id}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="p-5 sm:p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${vault.bgTint} ${vault.borderTint}`}>
                      <Icon className={`w-4 h-4 ${vault.textTint}`} />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs sm:text-sm font-bold font-mono text-zinc-950 truncate">{vault.name}</h4>
                      <span className="text-[10px] font-mono text-stone-400">Target: {vault.targetRatio}%</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${vault.bgTint} ${vault.textTint} border ${vault.borderTint}`}>
                    {vault.actualRatio.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-3.5">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">Current Partition</span>
                  <h3 className="text-xl sm:text-2xl font-mono font-black text-zinc-950 mt-0.5 truncate tracking-tight">
                    {formatCurrency(vault.balance, currentCurrency)}
                  </h3>
                  <p className="text-[11px] font-mono text-stone-500 mt-1.5 leading-relaxed line-clamp-2">
                    {vault.description}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="text-stone-400">Equilibrium:</span>
                  <span className="font-semibold text-zinc-800 truncate">
                    {formatCurrency(vault.targetBalance, currentCurrency)}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, vault.actualRatio)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: vault.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className={`truncate font-semibold ${isOverTarget ? "text-emerald-600" : "text-amber-600"}`}>
                    {isOverTarget ? "Equilibrium Met" : `${formatCurrency(Math.abs(vault.delta), currentCurrency)} under target`}
                  </span>
                  <span className="text-stone-400 shrink-0">Rule: Active</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Bottom Dual Tier — Proper p-4 sm:p-6 Padding Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 pt-2 [transform-style:preserve-3d]">
        
        {/* Left: Inter-Vault Shift Terminal Card */}
        <BotanicalCradle variant="amber" floatDelay={0.1}>
          <div className="w-full max-w-full space-y-5 p-3 sm:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-stone-100 gap-2 w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold font-mono text-zinc-950 truncate leading-tight">
                    Inter-Vault Shift Terminal
                  </h3>
                  <p className="text-[10px] font-mono text-stone-400 truncate">Atomic Internal Re-allocation</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                0% Fee • Instant
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleTransferSubmit} className="space-y-4 font-mono text-xs w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div className="w-full min-w-0">
                  <label className="text-[10px] uppercase text-stone-400 font-bold block mb-1.5">Source Partition</label>
                  <select
                    value={sourceVault}
                    onChange={(e) => setSourceVault(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-zinc-900 focus:outline-none focus:border-orange-500 cursor-pointer text-xs"
                  >
                    <option value="primary">Primary Operating</option>
                    <option value="reserve">Tax & Runway Reserve</option>
                    <option value="growth">Growth & R&D Capital</option>
                  </select>
                </div>

                <div className="w-full min-w-0">
                  <label className="text-[10px] uppercase text-stone-400 font-bold block mb-1.5">Target Partition</label>
                  <select
                    value={targetVault}
                    onChange={(e) => setTargetVault(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-zinc-900 focus:outline-none focus:border-orange-500 cursor-pointer text-xs"
                  >
                    <option value="reserve">Tax & Runway Reserve</option>
                    <option value="primary">Primary Operating</option>
                    <option value="growth">Growth & R&D Capital</option>
                  </select>
                </div>
              </div>

              <div className="w-full min-w-0">
                <label className="text-[10px] uppercase text-stone-400 font-bold block mb-1.5">
                  Transfer Amount ({currentCurrency})
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="w-full min-w-0">
                <label className="text-[10px] uppercase text-stone-400 font-bold block mb-1.5">Internal Allocation Note</label>
                <input
                  type="text"
                  placeholder="e.g., Q4 Tax Reserve Buffer"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-105 text-white font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 cursor-pointer transition-all mt-3"
              >
                <ArrowRightLeft className="w-4 h-4 text-orange-200 shrink-0" />
                <span className="truncate">EXECUTE INTERNAL RE-ALLOCATION</span>
              </motion.button>
            </form>
          </div>
        </BotanicalCradle>

        {/* Right: Internal Transfer Audit Log Card */}
        <BotanicalCradle variant="emerald" floatDelay={0.3}>
          <div className="w-full max-w-full flex flex-col justify-between h-full space-y-5 p-3 sm:p-5">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 gap-2 w-full">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold font-mono text-zinc-950 truncate leading-tight">
                    Internal Transfer Audit
                  </h3>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5 truncate">Real-time ledger of adjustments</p>
                </div>
                <div className="text-right shrink-0 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/70">
                  <span className="text-xs font-mono font-black text-zinc-950 block leading-tight">{transferHistory.length}</span>
                  <span className="text-[8px] font-mono text-stone-400 block uppercase font-bold">Recorded</span>
                </div>
              </div>

              {/* Transactions List */}
              <div className="mt-2.5 divide-y divide-stone-100/80 font-mono text-xs max-h-64 sm:max-h-72 overflow-y-auto no-scrollbar w-full">
                {transferHistory.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 text-xs font-mono">
                    No internal transfers executed yet.
                  </div>
                ) : (
                  transferHistory.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-2 hover:bg-stone-50/60 px-2 rounded-xl transition-colors w-full"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-stone-100 text-zinc-700 flex items-center justify-center shrink-0 border border-stone-200/80">
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-900 truncate text-[11px] sm:text-xs leading-tight">
                            <span className="capitalize">{item.sourceVault}</span> → <span className="capitalize">{item.targetVault}</span>
                          </p>
                          <span className="text-[9px] sm:text-[10px] text-stone-400 block truncate mt-0.5">
                            {item.note} • {formatDate(item.date)}
                          </span>
                        </div>
                      </div>

                      <span className="font-black text-xs sm:text-sm text-zinc-950 shrink-0 text-right pl-2">
                        {formatCurrency(item.amount, currentCurrency)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status Footer */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-[10px] sm:text-[11px] font-mono text-stone-500 flex items-center justify-between mt-2 w-full">
              <span>Equilibrium: <strong>Nominal</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" /> Client Partitioned
              </span>
            </div>
          </div>
        </BotanicalCradle>

      </div>
    </div>
  );
}