import React from "react";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Cpu, 
  Cloud, 
  Compass, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const CATEGORIES = [
  { id: "saas", label: "SaaS & APIs", amount: 200000, color: "bg-orange-500", icon: Cloud },
  { id: "gpu", label: "GPU Clusters", amount: 0, color: "bg-amber-500", icon: Cpu },
  { id: "lab", label: "Hardware Lab", amount: 0, color: "bg-blue-500", icon: Layers },
  { id: "ops", label: "Operations", amount: 0, color: "bg-emerald-500", icon: Compass }
];

export default function CategorySpectrum({ transactions = [], currentCurrency = "USD" }) {
  const totalOutflow = 200000;

  return (
    <div className="p-6 sm:p-8 rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.05),0_0_30px_rgba(255,255,255,0.9)_inset] relative overflow-hidden">
      {/* Top Tag & Metric */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
            Outflow
          </span>
          <span className="text-[10px] font-mono text-stone-400">Capital Allocation</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-3xl font-mono font-black text-zinc-950">
          {formatCurrency(totalOutflow, currentCurrency)}
        </h3>
        <span className="text-xs font-mono text-stone-400">Cycle Outflow</span>
      </div>

      {/* Dynamic Multi-Segment Allocation Bar */}
      <div className="mt-5 space-y-1.5">
        <div className="w-full h-2 rounded-full bg-stone-100 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span>0%</span>
          <span>Allocated Capital</span>
          <span>100%</span>
        </div>
      </div>

      {/* Vectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const share = totalOutflow > 0 ? Math.round((cat.amount / totalOutflow) * 100) : 0;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -2 }}
              className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  cat.amount > 0 ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-mono font-bold text-zinc-900 truncate">{cat.label}</p>
                  <p className="text-[10px] font-mono text-stone-400">{share}% Share</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-black text-zinc-950 block">
                  {formatCurrency(cat.amount, currentCurrency)}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Secured
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}