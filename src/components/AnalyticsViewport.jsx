import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Flame,
  RotateCcw,
  Sparkles,
  Layers,
  Server,
  Cpu,
  Home,
  Briefcase,
  Compass
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const CATEGORY_ICONS = {
  servers: Server,
  saas: Layers,
  hardware: Cpu,
  living: Home,
  misc: Briefcase,
  freelance: Briefcase,
  investment: TrendingUp
};

export default function AnalyticsViewport({ 
  transactions = [], 
  currentNetLiquidity = 200000, 
  currentCurrency = "USD" 
}) {
  const [burnDeltaPercent, setBurnDeltaPercent] = useState(0);

  const stats = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let maxSingleOutflow = { amount: 0, desc: "None", date: "-" };
    let categoryTally = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        totalInflow += amt;
      } else {
        totalOutflow += amt;
        if (amt > maxSingleOutflow.amount) {
          maxSingleOutflow = {
            amount: amt,
            desc: tx.description || "Capital Outflow",
            date: new Date(tx.date || tx.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          };
        }
        const cat = tx.category || "misc";
        categoryTally[cat] = (categoryTally[cat] || 0) + amt;
      }
    });

    const netSurplus = totalInflow - totalOutflow;
    const retentionRate = totalInflow > 0 
      ? Math.max(0, Math.round((netSurplus / totalInflow) * 100)) 
      : 0;

    const baseDailyBurn = totalOutflow > 0 ? totalOutflow / 30 : 250;
    const baseMonthsRunway = baseDailyBurn > 0 ? Math.round((currentNetLiquidity / (baseDailyBurn * 30)) * 10) / 10 : 99;

    const adjustedDailyBurn = baseDailyBurn * (1 + burnDeltaPercent / 100);
    const simulatedMonths = adjustedDailyBurn > 0 
      ? Math.round((currentNetLiquidity / (adjustedDailyBurn * 30)) * 10) / 10 
      : 99;
    const runwayDifference = Math.round((simulatedMonths - baseMonthsRunway) * 10) / 10;

    const sortedCategories = Object.entries(categoryTally)
      .map(([cat, amount]) => ({
        id: cat,
        amount,
        percentage: totalOutflow > 0 ? Math.round((amount / totalOutflow) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalInflow,
      totalOutflow,
      netSurplus,
      retentionRate,
      baseDailyBurn: Math.round(baseDailyBurn),
      simulatedDailyBurn: Math.round(adjustedDailyBurn),
      baseMonthsRunway,
      simulatedMonths,
      runwayDifference,
      maxSingleOutflow,
      sortedCategories
    };
  }, [transactions, currentNetLiquidity, burnDeltaPercent]);

  const sliderPercentage = ((burnDeltaPercent - (-50)) / (50 - (-50))) * 100;

  return (
    <div className="relative space-y-6 select-none pb-28 [perspective:1600px] overflow-visible">
      {/* Background Floating Ambient Aura Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/15 to-amber-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1.1, 0.9, 1.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-10 w-96 h-96 bg-gradient-to-bl from-rose-400/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* 1. Micro Telemetry Deck - Staggered Floating Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 [transform-style:preserve-3d]">
        
        {/* Retention Card - Gentle Float Cycle 1 */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ 
            y: -10, 
            rotateX: 0, 
            rotateY: 0, 
            scale: 1.03, 
            zIndex: 30,
            transition: { type: "spring", stiffness: 450, damping: 20 } 
          }}
          style={{ rotateX: 3, rotateY: -2 }}
          className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_rgba(255,255,255,0.8)_inset] flex items-center justify-between cursor-pointer transition-shadow hover:shadow-[0_25px_50px_-12px_rgba(234,88,12,0.12)] relative"
        >
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">
              Retention
            </span>
            <p className="text-xl sm:text-2xl font-mono font-black text-zinc-950 mt-0.5">
              {stats.retentionRate}%
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 shrink-0" /> Preserved
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0 shadow-xs">
            <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </motion.div>

        {/* Net Flow Card - Gentle Float Cycle 2 */}
        <motion.div
          animate={{ y: [-3, 4, -3] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ 
            y: -10, 
            rotateX: 0, 
            rotateY: 0, 
            scale: 1.03, 
            zIndex: 30,
            transition: { type: "spring", stiffness: 450, damping: 20 } 
          }}
          style={{ rotateX: 3, rotateY: -1 }}
          className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_rgba(255,255,255,0.8)_inset] flex items-center justify-between cursor-pointer transition-shadow hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.12)] relative"
        >
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">
              Net Flow
            </span>
            <p className={`text-base sm:text-2xl font-mono font-black mt-0.5 truncate ${stats.netSurplus >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {stats.netSurplus >= 0 ? "+" : ""}{formatCurrency(stats.netSurplus, currentCurrency)}
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 mt-0.5 block">Cycle Delta</span>
          </div>
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${
            stats.netSurplus >= 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
            {stats.netSurplus >= 0 ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
        </motion.div>

        {/* Peak Outflow Card - Gentle Float Cycle 3 */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ 
            y: -10, 
            rotateX: 0, 
            rotateY: 0, 
            scale: 1.03, 
            zIndex: 30,
            transition: { type: "spring", stiffness: 450, damping: 20 } 
          }}
          style={{ rotateX: 3, rotateY: 1 }}
          className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_rgba(255,255,255,0.8)_inset] flex items-center justify-between cursor-pointer transition-shadow hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.12)] relative"
        >
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">
              Peak Outflow
            </span>
            <p className="text-base sm:text-xl font-mono font-black text-zinc-950 mt-0.5 truncate">
              {formatCurrency(stats.maxSingleOutflow.amount, currentCurrency)}
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 truncate block mt-0.5">
              {stats.maxSingleOutflow.desc}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0 shadow-xs">
            <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </motion.div>

        {/* Mean Burn Card - Gentle Float Cycle 4 */}
        <motion.div
          animate={{ y: [-4, 3, -4] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ 
            y: -10, 
            rotateX: 0, 
            rotateY: 0, 
            scale: 1.03, 
            zIndex: 30,
            transition: { type: "spring", stiffness: 450, damping: 20 } 
          }}
          style={{ rotateX: 3, rotateY: 2 }}
          className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_20px_rgba(255,255,255,0.8)_inset] flex items-center justify-between cursor-pointer transition-shadow hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.12)] relative"
        >
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">
              Mean Burn
            </span>
            <p className="text-base sm:text-2xl font-mono font-black text-zinc-950 mt-0.5 truncate">
              {formatCurrency(stats.baseDailyBurn, currentCurrency)}<span className="text-[10px] text-stone-400 font-normal">/d</span>
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1 mt-0.5">
              <Flame className="w-3 h-3 shrink-0" /> Pacing
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </motion.div>
      </div>

      {/* 2. Flagship Master Simulator: Heavy Floating Monolith */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          y: -12,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1.01,
          zIndex: 20,
          transition: { type: "spring", stiffness: 300, damping: 22 }
        }}
        style={{ rotateX: 4, rotateZ: -0.6 }}
        className="relative z-10 p-6 sm:p-9 rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-zinc-900 to-zinc-950 text-white border border-stone-800 shadow-[0_35px_80px_-20px_rgba(0,0,0,0.6),0_0_40px_rgba(234,88,12,0.1)] overflow-hidden cursor-pointer"
      >
        {/* Living Plasma Aura Glow */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-orange-600 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800/90">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-xs">
                <Sliders className="w-3 h-3 text-orange-400" />
                <span>Simulation Lab</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" /> Continuous Floating Telemetry
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white mt-2.5">
              Capital Stress Simulator
            </h3>
            <p className="text-xs sm:text-sm font-sans text-stone-400 mt-1">
              Adjust outrate pacing to project liquidity exhaustion dates in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
            <div className="px-4 py-2.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-left sm:text-right shadow-inner">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-stone-400 block">Projected</span>
              <span className="text-lg sm:text-2xl font-mono font-black text-orange-400">{stats.simulatedMonths} Mo</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-left sm:text-right shadow-inner">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-stone-400 block">Shift</span>
              <span className={`text-lg sm:text-2xl font-mono font-black ${stats.runwayDifference >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {stats.runwayDifference >= 0 ? "+" : ""}{stats.runwayDifference} Mo
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-semibold text-[11px] sm:text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              -50% Austerity
            </span>
            <div className="px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-mono font-bold text-xs shadow-inner">
              {burnDeltaPercent > 0 
                ? `+${burnDeltaPercent}% Surge` 
                : burnDeltaPercent < 0 
                ? `${burnDeltaPercent}% Cut` 
                : "Nominal (0%)"}
            </div>
            <span className="text-rose-400 font-semibold text-[11px] sm:text-xs flex items-center gap-1.5">
              +50% Expansion
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            </span>
          </div>

          <div className="relative py-2 flex items-center">
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={burnDeltaPercent}
              onChange={(e) => setBurnDeltaPercent(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #059669 0%, #ea580c ${sliderPercentage}%, #27272a ${sliderPercentage}%, #27272a 100%)`
              }}
              className="w-full h-3 rounded-full appearance-none cursor-grab active:cursor-grabbing focus:outline-none transition-all touch-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(234,88,12,0.9)]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] sm:text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              {[
                { label: "-30%", val: -30 },
                { label: "Nominal (0%)", val: 0 },
                { label: "+30%", val: 30 }
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBurnDeltaPercent(p.val)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-mono transition-all cursor-pointer border ${
                    burnDeltaPercent === p.val
                      ? "bg-stone-800 text-orange-400 border-orange-500/50 font-bold shadow-xs"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span>Daily Drain: <strong className="text-stone-200">{formatCurrency(stats.simulatedDailyBurn, currentCurrency)}</strong></span>
              {burnDeltaPercent !== 0 && (
                <button
                  type="button"
                  onClick={() => setBurnDeltaPercent(0)}
                  className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Overlapping Luxury Flow Cards (Negative Margin + Asymmetrical Float) */}
      <div className="-mt-3 sm:-mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 relative z-20 [transform-style:preserve-3d]">
        
        {/* Inflow Card - Layered Elevation */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            y: -10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.02,
            zIndex: 30,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
          style={{ rotateX: 3, rotateY: -2.5, rotateZ: -0.5 }}
          className="p-6 sm:p-7 rounded-[30px] sm:rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-[0_30px_70px_-15px_rgba(16,185,129,0.14)]"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">Aggregate Capital Inflow</h4>
                  <p className="text-[10px] font-mono text-stone-400">Total liquidity captured</p>
                </div>
              </div>
              <span className="text-lg sm:text-xl font-mono font-black text-emerald-600 truncate">
                +{formatCurrency(stats.totalInflow, currentCurrency)}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-500">Protection Factor</span>
                <span className="font-bold text-zinc-900">{stats.retentionRate}% Retained</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 p-0.5 overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.retentionRate}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-emerald-500 shadow-xs relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-stone-400 mt-5 pt-3 border-t border-stone-100">
            Higher retention indicates sustainable surplus liquidity accumulation.
          </p>
        </motion.div>

        {/* Drain Card - Layered Elevation */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            y: -10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1.02,
            zIndex: 30,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
          style={{ rotateX: 3, rotateY: 2.5, rotateZ: 0.5 }}
          className="p-6 sm:p-7 rounded-[30px] sm:rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] flex flex-col justify-between cursor-pointer transition-shadow hover:shadow-[0_30px_70px_-15px_rgba(234,88,12,0.14)]"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">Aggregate Capital Drain</h4>
                  <p className="text-[10px] font-mono text-stone-400">Cycle expenditures</p>
                </div>
              </div>
              <span className="text-lg sm:text-xl font-mono font-black text-zinc-950 truncate">
                -{formatCurrency(stats.totalOutflow, currentCurrency)}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-500">Outflow Pressure</span>
                <span className="font-bold text-zinc-900">
                  {stats.totalInflow > 0 ? Math.min(100, Math.round((stats.totalOutflow / stats.totalInflow) * 100)) : 100}% of Inflow
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 p-0.5 overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${stats.totalInflow > 0 ? Math.min(100, Math.round((stats.totalOutflow / stats.totalInflow) * 100)) : 100}%` 
                  }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-orange-600 shadow-xs relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-mono text-stone-400 mt-5 pt-3 border-t border-stone-100">
            Target benchmark is maintaining outrate under 65% of gross incoming capital.
          </p>
        </motion.div>
      </div>

      {/* 4. Luxury Allocation Horizon Deck (Fills Screen Base with Ceramic Precision) */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          y: -6,
          rotateX: 0,
          scale: 1.01,
          zIndex: 25,
          transition: { type: "spring", stiffness: 400, damping: 20 }
        }}
        className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
              Capital Concentration
            </span>
            <h4 className="text-base sm:text-xl font-bold font-mono text-zinc-950 mt-0.5">
              Cycle Expense Concentration
            </h4>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {stats.sortedCategories.length} Active Vectors Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {stats.sortedCategories.length > 0 ? (
            stats.sortedCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Briefcase;
              return (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 flex items-center justify-between shadow-2xs hover:bg-white hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-mono font-bold capitalize text-zinc-900 truncate">{cat.id}</p>
                      <p className="text-[10px] font-mono text-stone-400">{cat.percentage}% of drain</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-zinc-950 shrink-0">
                    {formatCurrency(cat.amount, currentCurrency)}
                  </span>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-xs font-mono text-stone-400">
              No outflow transactions recorded in this cycle.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}