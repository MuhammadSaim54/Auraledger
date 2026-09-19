import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Flame, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  TrendingDown 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function RunwayPredictor({ 
  currentBalance = 200000, 
  transactions = [], 
  currentCurrency = "USD" 
}) {
  const { 
    dailyBurn, 
    monthlyBurn, 
    runwayMonths, 
    runwayDays, 
    status,
    zeroDate,
    gaugePercentage
  } = useMemo(() => {
    let totalExpense = 0;
    transactions.forEach((tx) => {
      if (tx.type === "expense") totalExpense += Number(tx.amount) || 0;
    });

    const dBurn = totalExpense > 0 ? totalExpense / 30 : 260;
    const mBurn = dBurn * 30;

    const days = dBurn > 0 ? Math.floor(currentBalance / dBurn) : 999;
    const months = Math.round((days / 30) * 10) / 10;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.min(days, 3650));
    const zeroDateStr = targetDate.toLocaleDateString("en-US", { 
      month: "short", 
      year: "numeric" 
    });

    let healthStatus = {
      label: "Optimal",
      color: "text-emerald-700",
      bg: "bg-emerald-50/90",
      border: "border-emerald-200",
      icon: ShieldCheck
    };

    if (months < 6) {
      healthStatus = {
        label: "Critical",
        color: "text-rose-700",
        bg: "bg-rose-50/90",
        border: "border-rose-200",
        icon: AlertTriangle
      };
    } else if (months < 12) {
      healthStatus = {
        label: "Moderate",
        color: "text-amber-700",
        bg: "bg-amber-50/90",
        border: "border-amber-200",
        icon: Flame
      };
    }

    const gaugePct = Math.min(100, Math.max(10, Math.round((months / 24) * 100)));

    return {
      dailyBurn: Math.round(dBurn),
      monthlyBurn: Math.round(mBurn),
      runwayMonths: months,
      runwayDays: days,
      status: healthStatus,
      zeroDate: zeroDateStr,
      gaugePercentage: gaugePct
    };
  }, [currentBalance, transactions]);

  const StatusIcon = status.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 sm:p-7 rounded-[28px] sm:rounded-[32px] bg-white border border-stone-200/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.03)] select-none flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 border border-orange-500/20">
                <Zap className="w-3 h-3 text-orange-600" />
                <span>Runway</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">Burn Horizon</span>
            </div>

            <div className="flex items-baseline gap-2 mt-1.5 sm:mt-2">
              <h4 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">
                {runwayMonths} <span className="text-sm sm:text-lg font-bold text-stone-400">Months</span>
              </h4>
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">({runwayDays} Days)</span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 text-[11px] font-mono font-bold ${status.bg} ${status.border} ${status.color}`}>
            <StatusIcon className="w-3 h-3 shrink-0" />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Gauge Track */}
        <div className="mt-4 sm:mt-5 space-y-1.5">
          <div className="w-full h-3 rounded-full bg-stone-100/90 overflow-hidden flex p-0.5 border border-stone-200/60 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${gaugePercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-0.5">
            <span>Critical</span>
            <span>Sustainable (12M)</span>
            <span>Enduring</span>
          </div>
        </div>
      </div>

      {/* Metrics Row (3 Columns on all screens with compact font) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-4 sm:mt-6">
        <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-50/70 border border-stone-200/60">
          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">
            <Flame className="w-3 h-3 text-orange-600 shrink-0 hidden sm:block" />
            <span>24h Burn</span>
          </div>
          <p className="text-xs sm:text-base font-mono font-bold text-zinc-950 truncate">
            {formatCurrency(dailyBurn, currentCurrency)}
          </p>
          <span className="text-[8px] sm:text-[10px] font-mono text-stone-400 hidden sm:block">Daily Outflow</span>
        </div>

        <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-50/70 border border-stone-200/60">
          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">
            <TrendingDown className="w-3 h-3 text-rose-600 shrink-0 hidden sm:block" />
            <span>Monthly</span>
          </div>
          <p className="text-xs sm:text-base font-mono font-bold text-zinc-950 truncate">
            {formatCurrency(monthlyBurn, currentCurrency)}
          </p>
          <span className="text-[8px] sm:text-[10px] font-mono text-stone-400 hidden sm:block">30-Day Runrate</span>
        </div>

        <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-50/70 border border-stone-200/60">
          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-0.5">
            <Calendar className="w-3 h-3 text-sky-600 shrink-0 hidden sm:block" />
            <span>Zero Date</span>
          </div>
          <p className="text-xs sm:text-base font-mono font-bold text-zinc-950 truncate">
            {zeroDate}
          </p>
          <span className="text-[8px] sm:text-[10px] font-mono text-stone-400 hidden sm:block">Depletion</span>
        </div>
      </div>
    </motion.div>
  );
}