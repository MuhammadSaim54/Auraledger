import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Server, 
  Layers, 
  Cpu, 
  Home, 
  PieChart, 
  ShieldCheck 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const CATEGORY_META = {
  servers: { label: "GPU Clusters", color: "#c2410c", icon: Server },
  saas: { label: "SaaS & APIs", color: "#ea580c", icon: Layers },
  hardware: { label: "Hardware Lab", color: "#0284c7", icon: Cpu },
  living: { label: "Operations", color: "#059669", icon: Home },
  default: { label: "General Outflow", color: "#71717a", icon: PieChart }
};

export default function CategorySpectrum({ transactions = [], currentCurrency = "USD" }) {
  const { totalExpense, breakdown } = useMemo(() => {
    let total = 0;
    const catMap = { servers: 0, saas: 0, hardware: 0, living: 0 };

    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const amt = Number(tx.amount) || 0;
        total += amt;
        const cat = (tx.category || "").toLowerCase();
        if (catMap[cat] !== undefined) {
          catMap[cat] += amt;
        } else {
          catMap.living += amt;
        }
      }
    });

    if (total === 0) {
      catMap.servers = 3200;
      catMap.saas = 1850;
      catMap.hardware = 2400;
      catMap.living = 1200;
      total = 3200 + 1850 + 2400 + 1200;
    }

    const items = Object.entries(catMap).map(([catKey, amount]) => {
      const meta = CATEGORY_META[catKey] || CATEGORY_META.default;
      const pct = total > 0 ? (amount / total) * 100 : 0;
      return {
        key: catKey,
        amount,
        percentage: Math.round(pct * 10) / 10,
        ...meta
      };
    });

    return { totalExpense: total, breakdown: items };
  }, [transactions]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 sm:p-7 rounded-[28px] sm:rounded-[32px] bg-white border border-stone-200/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.03)] select-none flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 border border-orange-500/20">
                <PieChart className="w-3 h-3 text-orange-600" />
                <span>Outflow</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">Capital Allocation</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5 sm:mt-2">
              <h4 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">
                {formatCurrency(totalExpense, currentCurrency)}
              </h4>
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">Cycle Outflow</span>
            </div>
          </div>
        </div>

        {/* Segmented Track */}
        <div className="mt-4 sm:mt-5 space-y-1.5">
          <div className="w-full h-3 rounded-full bg-stone-100/90 overflow-hidden flex p-0.5 gap-1 border border-stone-200/60 shadow-inner">
            {breakdown.map((item, idx) => {
              if (item.percentage <= 0) return null;
              return (
                <motion.div
                  key={item.key}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: `${item.percentage}%`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.85, 
                    delay: 0.15 + idx * 0.08,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  style={{ backgroundColor: item.color }}
                  className="h-full rounded-full"
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-0.5">
            <span>0%</span>
            <span>Allocated Capital</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
        {breakdown.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.15 + idx * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 leading-tight">{item.label}</p>
                  <p className="text-[10px] font-mono text-stone-400">{item.percentage}% Share</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-mono font-bold text-zinc-950">
                  {formatCurrency(item.amount, currentCurrency)}
                </p>
                <div className="inline-flex items-center gap-0.5 text-[9px] font-mono text-emerald-600 font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Secured</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}