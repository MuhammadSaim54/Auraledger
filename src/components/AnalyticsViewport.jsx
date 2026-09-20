import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
  ShoppingBag,
  Utensils,
  Code2,
  Shirt,
  Home,
  Briefcase,
  PiggyBank
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { CATEGORIES } from "../types/models";
import BotanicalCradle from "./BotanicalCradle";

// Mapped directly to AuraLedger standard CATEGORIES
const CATEGORY_ICON_MAP = {
  groceries: ShoppingBag,
  dining: Utensils,
  dev: Code2,
  lifestyle: Shirt,
  housing: Home,
  freelance: Briefcase,
  investments: PiggyBank
};

export default function AnalyticsViewport({ 
  transactions = [], 
  currentNetLiquidity = 0, 
  currentCurrency = "USD" 
}) {
  const [burnDeltaPercent, setBurnDeltaPercent] = useState(0);
  const [timeHorizon, setTimeHorizon] = useState("30d");

  const stats = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let maxSingleOutflow = { amount: 0, desc: "None", date: "-" };
    const categoryTally = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        totalInflow += amt;
      } else {
        totalOutflow += amt;
        if (amt > maxSingleOutflow.amount) {
          maxSingleOutflow = {
            amount: amt,
            desc: tx.title || tx.description || "Capital Outflow",
            date: tx.date ? new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"
          };
        }
        const cat = tx.category || "groceries";
        categoryTally[cat] = (categoryTally[cat] || 0) + amt;
      }
    });

    const netSurplus = totalInflow - totalOutflow;
    const retentionRate = totalInflow > 0 
      ? Math.max(0, Math.round((netSurplus / totalInflow) * 100)) 
      : 0;

    const baseDailyBurn = totalOutflow > 0 ? totalOutflow / 30 : 0;
    const baseMonthsRunway = baseDailyBurn > 0 ? Math.round((currentNetLiquidity / (baseDailyBurn * 30)) * 10) / 10 : 99;

    const adjustedDailyBurn = baseDailyBurn * (1 + burnDeltaPercent / 100);
    const simulatedMonths = adjustedDailyBurn > 0 
      ? Math.round((currentNetLiquidity / (adjustedDailyBurn * 30)) * 10) / 10 
      : 99;
    const runwayDifference = Math.round((simulatedMonths - baseMonthsRunway) * 10) / 10;

    const sortedCategories = Object.entries(categoryTally)
      .map(([catId, amount]) => {
        const meta = CATEGORIES.find((c) => c.id === catId) || { label: catId, color: "#ea580c" };
        return {
          id: catId,
          label: meta.label,
          color: meta.color,
          amount,
          percentage: totalOutflow > 0 ? Math.round((amount / totalOutflow) * 100) : 0
        };
      })
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
    <div className="relative space-y-8 sm:space-y-12 select-none pb-28 [perspective:1400px]">
      
      {/* 1. Header Micro-Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-12px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">Retention</span>
            <p className="text-xl sm:text-2xl font-mono font-black text-zinc-950 mt-0.5">{stats.retentionRate}%</p>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 shrink-0" /> Preserved
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-12px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">Net Flow</span>
            <p className={`text-base sm:text-2xl font-mono font-black mt-0.5 truncate ${stats.netSurplus >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
              {stats.netSurplus >= 0 ? "+" : ""}{formatCurrency(stats.netSurplus, currentCurrency)}
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 mt-0.5 block">Cycle Delta</span>
          </div>
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
            stats.netSurplus >= 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
            {stats.netSurplus >= 0 ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-12px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">Peak Outflow</span>
            <p className="text-base sm:text-xl font-mono font-black text-zinc-950 mt-0.5 truncate">
              {formatCurrency(stats.maxSingleOutflow.amount, currentCurrency)}
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 truncate block mt-0.5">
              {stats.maxSingleOutflow.desc}
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_-12px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider block truncate">Daily Burn</span>
            <p className="text-base sm:text-2xl font-mono font-black text-zinc-950 mt-0.5 truncate">
              {formatCurrency(stats.baseDailyBurn, currentCurrency)}<span className="text-[10px] text-stone-400 font-normal">/d</span>
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1 mt-0.5">
              <Flame className="w-3 h-3 shrink-0" /> Pacing
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* 2. Flagship Simulator Monolith */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-zinc-950 text-white border border-stone-800 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-orange-400" />
                <span>Simulation Lab</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">Runway Horizon Stress Math</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-2">
              Capital Stress Simulator
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Adjust outrate pacing to project liquidity exhaustion dates in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
            <div className="px-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-left sm:text-right">
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block">Simulated Runway</span>
              <span className="text-xl font-mono font-black text-orange-400">{stats.simulatedMonths} Mo</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-left sm:text-right">
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block">Variance Delta</span>
              <span className={`text-xl font-mono font-black ${stats.runwayDifference >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {stats.runwayDifference >= 0 ? "+" : ""}{stats.runwayDifference} Mo
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-semibold">-50% Austerity</span>
            <div className="px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-mono font-bold text-xs">
              {burnDeltaPercent > 0 
                ? `+${burnDeltaPercent}% Surge` 
                : burnDeltaPercent < 0 
                ? `${burnDeltaPercent}% Cut` 
                : "Nominal Pacing (0%)"}
            </div>
            <span className="text-rose-400 font-semibold">+50% Expansion</span>
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
              className="w-full h-2.5 rounded-full appearance-none cursor-grab active:cursor-grabbing focus:outline-none transition-all touch-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(234,88,12,0.8)]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-stone-400">
            <div className="flex items-center gap-1.5">
              {[
                { label: "-30%", val: -30 },
                { label: "Nominal (0%)", val: 0 },
                { label: "+30%", val: 30 }
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBurnDeltaPercent(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer border ${
                    burnDeltaPercent === p.val
                      ? "bg-stone-800 text-orange-400 border-orange-500/40 font-bold"
                      : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span>Projected Drain: <strong className="text-stone-200">{formatCurrency(stats.simulatedDailyBurn, currentCurrency)}</strong></span>
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
      </div>

      {/* 3. Inflow & Outflow Cradles (Botanical Sculptures) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 pt-2 [transform-style:preserve-3d]">
        <BotanicalCradle variant="emerald" floatDelay={0.1}>
          <div className="p-6 sm:p-7 rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-tight">Aggregate Capital Inflow</h4>
                    <p className="text-[10px] font-mono text-stone-400">Total liquidity captured</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-mono font-black text-emerald-600 truncate">
                  +{formatCurrency(stats.totalInflow, currentCurrency)}
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500">Protection Factor</span>
                  <span className="font-bold text-zinc-900">{stats.retentionRate}% Retained</span>
                </div>
                
                <div className="w-full h-2.5 sm:h-3 rounded-full bg-stone-100 p-0.5 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.retentionRate}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-emerald-500 shadow-xs relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-stone-400 mt-4 pt-3 border-t border-stone-100">
              Higher retention indicates sustainable surplus liquidity accumulation.
            </p>
          </div>
        </BotanicalCradle>

        <BotanicalCradle variant="amber" floatDelay={0.5}>
          <div className="p-6 sm:p-7 rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-tight">Aggregate Capital Drain</h4>
                    <p className="text-[10px] font-mono text-stone-400">Cycle expenditures</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-mono font-black text-zinc-950 truncate">
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

                <div className="w-full h-2.5 sm:h-3 rounded-full bg-stone-100 p-0.5 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${stats.totalInflow > 0 ? Math.min(100, Math.round((stats.totalOutflow / stats.totalInflow) * 100)) : 100}%` 
                    }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-orange-600 shadow-xs relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-stone-400 mt-4 pt-3 border-t border-stone-100">
              Target benchmark is maintaining outrate under 65% of gross incoming capital.
            </p>
          </div>
        </BotanicalCradle>
      </div>

      {/* 4. Category Capital Allocation Progress Matrix */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">Capital Concentration</span>
            <h4 className="text-base sm:text-xl font-bold font-mono text-zinc-950 mt-0.5">Cycle Expense Vectors</h4>
          </div>
          <span className="text-xs font-mono text-stone-400">{stats.sortedCategories.length} Active Vectors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {stats.sortedCategories.length > 0 ? (
            stats.sortedCategories.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.id] || Briefcase;
              return (
                <div key={cat.id} className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2.5 shadow-2xs hover:bg-white hover:border-orange-500/30 transition-all">
                  <div className="flex items-center justify-between truncate">
                    <div className="flex items-center gap-2.5 truncate">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-mono font-bold text-zinc-900 truncate">{cat.label}</p>
                        <p className="text-[10px] font-mono text-stone-400">{cat.percentage}% of drain</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-zinc-950 shrink-0">
                      {formatCurrency(cat.amount, currentCurrency)}
                    </span>
                  </div>

                  {/* Horizontal visual allocation meter */}
                  <div className="w-full h-1.5 rounded-full bg-stone-200/80 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-xs font-mono text-stone-400">
              No outflow transactions recorded in this cycle.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}