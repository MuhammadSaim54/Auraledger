import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function AutoRebalanceModal({
  isOpen,
  onClose,
  proposals = [],
  totalLiquidity = 0,
  onApplyRebalance,
  currentCurrency = "USD"
}) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[520px] bg-white border border-stone-200/90 rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] p-6 sm:p-7 z-10 select-none my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Rebalancing</span>
              </div>
              <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-950 mt-0.5">
                Target Allocation Equilibrium
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

          <p className="text-xs text-stone-500 font-sans mt-3">
            System will automatically execute optimized intra-vault transfers to align total net liquidity (<strong className="text-zinc-900">{formatCurrency(totalLiquidity, currentCurrency)}</strong>) with target allocations (50% Primary, 30% Reserve, 20% Growth).
          </p>

          {/* Proposals List */}
          <div className="mt-4 space-y-2.5">
            {proposals.length > 0 ? (
              proposals.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-xs font-mono min-w-0">
                    <span className="capitalize font-bold text-zinc-800 truncate">{item.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="capitalize font-bold text-zinc-800 truncate">{item.to}</span>
                  </div>

                  <span className="text-xs font-mono font-black text-orange-600 shrink-0">
                    +{formatCurrency(item.amount, currentCurrency)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs font-mono text-stone-400 bg-stone-50 rounded-2xl border border-stone-200/60">
                All vaults are currently within nominal equilibrium tolerances.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-mono font-semibold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={proposals.length === 0}
              onClick={() => {
                onApplyRebalance(proposals);
                onClose();
              }}
              className="flex-[2] py-3 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-orange-400" />
              <span>Apply 1-Click Rebalance</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}