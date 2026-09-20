import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  TrendingDown, 
  Calendar, 
  ShieldCheck 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function RunwayPredictor({
  currentBalance = 200000,
  transactions = [],
  currentCurrency = "USD"
}) {
  const { runwayMonths, dailyBurn, monthlyRunrate, zeroDateStr, healthStatus } = useMemo(() => {
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type !== "income") {
        totalExpense += Number(tx.amount) || 0;
      }
    });

    const calculatedDailyBurn = totalExpense > 0 ? totalExpense / 30 : 6667;
    const calculatedMonthlyRunrate = calculatedDailyBurn * 30;

    const daysRemaining = calculatedDailyBurn > 0 
      ? Math.round(currentBalance / calculatedDailyBurn) 
      : 1575;

    const monthsRemaining = Math.max(0, Math.round((daysRemaining / 30) * 10) / 10);

    const zeroDate = new Date();
    zeroDate.setDate(zeroDate.getDate() + daysRemaining);
    const formattedZeroDate = zeroDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    let status = { label: "Optimal", color: "bg-emerald-50 text-emerald-600 border-emerald-200/70" };
    if (monthsRemaining < 6) {
      status = { label: "Critical", color: "bg-rose-50 text-rose-600 border-rose-200/70" };
    } else if (monthsRemaining < 12) {
      status = { label: "Cautious", color: "bg-amber-50 text-amber-600 border-amber-200/70" };
    }

    return {
      runwayMonths: monthsRemaining || 52.5,
      dailyBurn: Math.round(calculatedDailyBurn),
      monthlyRunrate: Math.round(calculatedMonthlyRunrate),
      zeroDateStr: formattedZeroDate || "Jan 2031",
      healthStatus: status,
      daysRemaining
    };
  }, [currentBalance, transactions]);

  return (
    <div className="p-5 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[36px] bg-white sm:bg-white/90 backdrop-blur-2xl border border-stone-200/90 sm:border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05),0_0_30px_rgba(255,255,255,0.9)_inset] relative overflow-hidden">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Runway
          </span>
          <span className="text-[10px] font-mono text-stone-400">Burn Horizon</span>
        </div>

        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold border flex items-center gap-1.5 shadow-2xs shrink-0 ${healthStatus.color}`}>
          <ShieldCheck className="w-3.5 h-3.5" /> {healthStatus.label}
        </span>
      </div>

      {/* 2. Primary Metric */}
      <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-2">
        <h3 className="text-2xl sm:text-3xl font-mono font-black text-zinc-950">
          {runwayMonths} <span className="text-lg sm:text-xl text-stone-400 font-normal">Months</span>
        </h3>
        <span className="text-[11px] sm:text-xs font-mono text-stone-400">
          ({Math.round(runwayMonths * 30)} Days)
        </span>
      </div>

      {/* 3. Horizon Gauge Track */}
      <div className="mt-4 sm:mt-5 space-y-1.5">
        <div className="w-full h-2 rounded-full bg-stone-100 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(15, (runwayMonths / 36) * 100))}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-stone-400">
          <span>Critical</span>
          <span className="hidden xs:inline">Sustainable (12M)</span>
          <span className="text-emerald-600 font-bold">Enduring</span>
        </div>
      </div>

      {/* 4. Adaptive Metric Cards (Mobile Grid Fix) */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
        {/* Daily Burn */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 flex xs:flex-col justify-between items-center xs:items-start">
          <div>
            <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500 shrink-0" /> 24H Burn
            </span>
            <p className="text-xs sm:text-sm font-mono font-black text-zinc-950 mt-1 truncate">
              {formatCurrency(dailyBurn, currentCurrency)}
            </p>
          </div>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">Daily Outflow</span>
        </div>

        {/* Monthly Runrate */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 flex xs:flex-col justify-between items-center xs:items-start">
          <div>
            <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" /> Monthly
            </span>
            <p className="text-xs sm:text-sm font-mono font-black text-zinc-950 mt-1 truncate">
              {formatCurrency(monthlyRunrate, currentCurrency)}
            </p>
          </div>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">30-Day Runrate</span>
        </div>

        {/* Zero Date Depletion */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 flex xs:flex-col justify-between items-center xs:items-start">
          <div>
            <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-500 shrink-0" /> Zero Date
            </span>
            <p className="text-xs sm:text-sm font-mono font-black text-zinc-950 mt-1 whitespace-nowrap">
              {zeroDateStr}
            </p>
          </div>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">Depletion</span>
        </div>
      </div>
    </div>
  );
}