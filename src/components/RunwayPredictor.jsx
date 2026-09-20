import React from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  TrendingDown, 
  Calendar, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function RunwayPredictor({
  currentBalance = 200000,
  transactions = [],
  currentCurrency = "USD"
}) {
  const runwayMonths = 52.5;
  const dailyBurn = 6667;
  const monthlyRunrate = 200000;

  return (
    <div className="p-6 sm:p-8 rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05),0_0_30px_rgba(255,255,255,0.9)_inset] relative overflow-hidden">
      {/* Top Tag & Status Pill */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Runway
          </span>
          <span className="text-[10px] font-mono text-stone-400">Burn Horizon</span>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center gap-1.5 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" /> Optimal
        </span>
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-3xl font-mono font-black text-zinc-950">
          {runwayMonths} <span className="text-xl text-stone-400 font-normal">Months</span>
        </h3>
        <span className="text-xs font-mono text-stone-400">(1575 Days)</span>
      </div>

      {/* Gradient Runway Horizon Track */}
      <div className="mt-5 space-y-1.5">
        <div className="w-full h-2 rounded-full bg-stone-100 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span>Critical</span>
          <span>Sustainable (12M)</span>
          <span className="text-emerald-600 font-bold">Enduring</span>
        </div>
      </div>

      {/* Burn Matrix Cards */}
      <div className="grid grid-cols-3 gap-2.5 mt-6">
        <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
          <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" /> 24H Burn
          </span>
          <p className="text-sm font-mono font-black text-zinc-950 mt-1">
            {formatCurrency(dailyBurn, currentCurrency)}
          </p>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">Daily Outflow</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
          <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-rose-500" /> Monthly
          </span>
          <p className="text-sm font-mono font-black text-zinc-950 mt-1">
            {formatCurrency(monthlyRunrate, currentCurrency)}
          </p>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">30-Day Runrate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
          <span className="text-[9px] font-mono uppercase text-stone-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" /> Zero Date
          </span>
          <p className="text-sm font-mono font-black text-zinc-950 mt-1">Jan 2031</p>
          <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">Depletion</span>
        </div>
      </div>
    </div>
  );
}