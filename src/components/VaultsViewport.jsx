import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRightLeft,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import VaultTransferModal from "./VaultTransferModal";
import AutoRebalanceModal from "./AutoRebalanceModal";
import BotanicalCradle from "./BotanicalCradle";

const VAULT_CONFIGS = [
  {
    id: "primary",
    label: "Primary Operating Vault",
    tag: "High Liquidity",
    description: "Daily operational cashflow, cloud compute, and immediate liquidity obligations.",
    icon: Building2,
    targetShare: 50,
    badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    barColor: "bg-orange-600",
    variant: "amber",
    floatDelay: 0
  },
  {
    id: "reserve",
    label: "Emergency Reserve",
    tag: "Protected Buffer",
    description: "Multi-quarter runway preservation lock. Strict minimum drawdown threshold enforced.",
    icon: ShieldCheck,
    targetShare: 30,
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    barColor: "bg-emerald-600",
    variant: "emerald",
    floatDelay: 0.3
  },
  {
    id: "growth",
    label: "Growth & Lab Capital",
    tag: "Yield & Venture",
    description: "High-conviction R&D initiatives, hardware expansions, and seed-stage lab deployments.",
    icon: Sparkles,
    targetShare: 20,
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    barColor: "bg-amber-600",
    variant: "amber",
    floatDelay: 0.6
  }
];

export default function VaultsViewport({
  vaultBalances = {},
  totalLiquidity = 0,
  onExecuteTransfer,
  transferHistory = [],
  currentCurrency = "USD"
}) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState(false);

  // Calculate Equilibrium Proposals
  const { proposals, maxVariance, isEquilibriumNeeded } = useMemo(() => {
    if (totalLiquidity <= 0) {
      return { proposals: [], maxVariance: 0, isEquilibriumNeeded: false };
    }

    const primaryBal = vaultBalances.primary || 0;
    const reserveBal = vaultBalances.reserve || 0;
    const growthBal = vaultBalances.growth || 0;

    const targetPrimary = Math.round(totalLiquidity * 0.5);
    const targetReserve = Math.round(totalLiquidity * 0.3);
    const targetGrowth = Math.round(totalLiquidity * 0.2);

    const deltaPrimary = primaryBal - targetPrimary; // positive = surplus, negative = deficit
    const deltaReserve = reserveBal - targetReserve;
    const deltaGrowth = growthBal - targetGrowth;

    const sharePrimary = Math.round((primaryBal / totalLiquidity) * 100);
    const shareReserve = Math.round((reserveBal / totalLiquidity) * 100);
    const shareGrowth = Math.round((growthBal / totalLiquidity) * 100);

    const v1 = Math.abs(sharePrimary - 50);
    const v2 = Math.abs(shareReserve - 30);
    const v3 = Math.abs(shareGrowth - 20);
    const highestVariance = Math.max(v1, v2, v3);

    const calculatedProposals = [];

    // Simple auto-balancer: surplus vaults fund deficit vaults
    const surpluses = [];
    const deficits = [];

    if (deltaPrimary > 0) surpluses.push({ id: "primary", amount: deltaPrimary });
    else if (deltaPrimary < 0) deficits.push({ id: "primary", amount: Math.abs(deltaPrimary) });

    if (deltaReserve > 0) surpluses.push({ id: "reserve", amount: deltaReserve });
    else if (deltaReserve < 0) deficits.push({ id: "reserve", amount: Math.abs(deltaReserve) });

    if (deltaGrowth > 0) surpluses.push({ id: "growth", amount: deltaGrowth });
    else if (deltaGrowth < 0) deficits.push({ id: "growth", amount: Math.abs(deltaGrowth) });

    surpluses.forEach((surp) => {
      deficits.forEach((def) => {
        if (surp.amount > 0 && def.amount > 0) {
          const shift = Math.min(surp.amount, def.amount);
          calculatedProposals.push({
            from: surp.id,
            to: def.id,
            amount: shift
          });
          surp.amount -= shift;
          def.amount -= shift;
        }
      });
    });

    return {
      proposals: calculatedProposals,
      maxVariance: highestVariance,
      isEquilibriumNeeded: highestVariance >= 4 // triggers banner if variance >= 4%
    };
  }, [vaultBalances, totalLiquidity]);

  const handleApplyBatchRebalance = (rebalanceProposals) => {
    rebalanceProposals.forEach((p) => {
      onExecuteTransfer({
        sourceVault: p.from,
        targetVault: p.to,
        amount: p.amount,
        note: "1-Click Auto-Rebalance Execution",
        timestamp: Date.now()
      });
    });
  };

  return (
    <div className="relative space-y-8 sm:space-y-12 select-none pb-28 [perspective:1400px]">
      {/* 1. Header Bar */}
      <div className="p-6 sm:p-7 rounded-[36px] bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
              Multi-Vault Architecture
            </span>
            <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-orange-500 animate-pulse" /> Kinetic Partition Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-950 mt-1.5">
            Capital Partitioning Suite
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Segmented liquidity protection across operating, reserve, and growth vaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isEquilibriumNeeded && (
            <button
              type="button"
              onClick={() => setIsRebalanceModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Auto-Rebalance ({maxVariance}% Off)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-zinc-950/10 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-orange-400" />
            <span>Transfer Capital</span>
          </button>
        </div>
      </div>

      {/* 2. Autonomous Equilibrium Alert Banner (Triggers on Variance) */}
      {isEquilibriumNeeded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-[26px] bg-gradient-to-r from-orange-50 via-amber-50 to-stone-50 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-900">
                Partition Equilibrium Discrepancy Detected ({maxVariance}% Drift)
              </h4>
              <p className="text-[11px] font-sans text-stone-600 mt-0.5">
                Current vault balances deviate from target allocation benchmarks. 1-Click Rebalance is available.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRebalanceModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-200" />
            <span>Review Equilibrium</span>
          </button>
        </motion.div>
      )}

      {/* 3. Three Dedicated Cradled Vault Monoliths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-2 [transform-style:preserve-3d]">
        {VAULT_CONFIGS.map((cfg) => {
          const Icon = cfg.icon;
          const balance = vaultBalances[cfg.id] || 0;
          const actualShare = totalLiquidity > 0 ? Math.round((balance / totalLiquidity) * 100) : 0;
          const variance = actualShare - cfg.targetShare;

          return (
            <BotanicalCradle key={cfg.id} variant={cfg.variant} floatDelay={cfg.floatDelay}>
              <div className="p-6 rounded-[34px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-2xs ${cfg.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                      {cfg.tag}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-base font-bold font-mono text-zinc-950">{cfg.label}</h4>
                    <p className="text-[11px] font-sans text-stone-500 mt-1 min-h-[34px] leading-relaxed">
                      {cfg.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Vault Liquidity
                    </span>
                    <p className="text-2xl font-mono font-black text-zinc-950 mt-0.5">
                      {formatCurrency(balance, currentCurrency)}
                    </p>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-500">Allocation Share</span>
                      <span className="font-bold text-zinc-900">
                        {actualShare}% <span className="text-stone-400 font-normal">/ {cfg.targetShare}% Target</span>
                      </span>
                    </div>
                    
                    <div className="w-full h-2.5 rounded-full bg-stone-100 p-0.5 overflow-hidden relative shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, actualShare)}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${cfg.barColor} shadow-xs relative overflow-hidden`}
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

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <span>Variance:</span>
                  <span className={`font-bold ${variance >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    {variance >= 0 ? `+${variance}% Over` : `${variance}% Under`}
                  </span>
                </div>
              </div>
            </BotanicalCradle>
          );
        })}
      </div>

      {/* 4. Re-allocation Audit Trail */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
              Audit Trail
            </span>
            <h4 className="text-base font-bold font-mono text-zinc-950 mt-0.5">
              Vault Movement Journal
            </h4>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {transferHistory.length} Recorded Transfers
          </span>
        </div>

        <div className="divide-y divide-stone-100 mt-2 font-mono text-xs">
          {transferHistory.length > 0 ? (
            transferHistory.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-3 group transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {item.note || "Internal Vault Transfer"}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      <span className="capitalize">{item.sourceVault}</span> → <span className="capitalize">{item.targetVault}</span> • {new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <span className="font-bold text-zinc-950 shrink-0">
                  {formatCurrency(item.amount, currentCurrency)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs font-mono text-stone-400">
              No internal vault transfers executed yet. Tap "Transfer Capital" to partition funds.
            </div>
          )}
        </div>
      </div>

      {/* Transfer Capital Modal */}
      <VaultTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        vaultBalances={vaultBalances}
        onTransfer={onExecuteTransfer}
        currentCurrency={currentCurrency}
      />

      {/* 1-Click Auto Rebalance Proposal Modal */}
      <AutoRebalanceModal
        isOpen={isRebalanceModalOpen}
        onClose={() => setIsRebalanceModalOpen(false)}
        proposals={proposals}
        totalLiquidity={totalLiquidity}
        onApplyRebalance={handleApplyBatchRebalance}
        currentCurrency={currentCurrency}
      />
    </div>
  );
}