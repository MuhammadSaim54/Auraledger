import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ChevronDown, 
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const VAULT_METAS = {
  primary: { 
    id: "primary", 
    label: "Primary Operating", 
    fullName: "Primary Operating Vault", 
    icon: Building2, 
    color: "text-orange-600 bg-orange-50 border-orange-200/60" 
  },
  reserve: { 
    id: "reserve", 
    label: "Emergency Reserve", 
    fullName: "Emergency Reserve", 
    icon: ShieldCheck, 
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/60" 
  },
  growth: { 
    id: "growth", 
    label: "Growth & Lab", 
    fullName: "Growth & Lab Capital", 
    icon: Sparkles, 
    color: "text-amber-600 bg-amber-50 border-amber-200/60" 
  }
};

function LuxuryVaultSelect({
  label,
  value,
  onChange,
  options = [],
  vaultBalances = {},
  currentCurrency = "USD",
  subtext
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMeta = VAULT_METAS[value] || VAULT_METAS.primary;
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 rounded-2xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300 text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${currentMeta.color}`}>
            <CurrentIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold text-zinc-900 truncate">
            {currentMeta.label}
          </span>
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-orange-600" : ""
          }`} 
        />
      </button>

      {subtext && (
        <span className="text-[10px] font-mono text-stone-400 block mt-1 px-1">
          {subtext}
        </span>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] space-y-1"
          >
            {options.map((key) => {
              const meta = VAULT_METAS[key];
              const Icon = meta.icon;
              const isSelected = value === key;
              const bal = vaultBalances[key] || 0;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected 
                      ? "bg-stone-100/90 text-zinc-950 font-bold" 
                      : "hover:bg-stone-50 text-stone-600 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${meta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-mono font-medium leading-tight truncate">
                        {meta.label}
                      </p>
                      <p className="text-[9px] font-mono text-stone-400">
                        {formatCurrency(bal, currentCurrency)}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VaultTransferModal({
  isOpen,
  onClose,
  vaultBalances = {},
  onTransfer,
  currentCurrency = "USD"
}) {
  const [sourceVault, setSourceVault] = useState("primary");
  const [targetVault, setTargetVault] = useState("reserve");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [safetyOverrideAcknowledged, setSafetyOverrideAcknowledged] = useState(false);

  if (!isOpen) return null;

  const availableBalance = vaultBalances[sourceVault] || 0;
  const numAmt = parseFloat(amount) || 0;

  // Safety Lock Threshold: If draining from Reserve and removing > 50% of available reserve
  const isBreachingReserveThreshold = 
    sourceVault === "reserve" && 
    availableBalance > 0 && 
    numAmt > availableBalance * 0.5;

  const handleSourceChange = (val) => {
    setSourceVault(val);
    if (val === targetVault) {
      const options = ["primary", "reserve", "growth"].filter((k) => k !== val);
      setTargetVault(options[0]);
    }
    setError("");
    setSafetyOverrideAcknowledged(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!numAmt || numAmt <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }

    if (numAmt > availableBalance) {
      setError(`Insufficient liquidity. Max transferable is ${formatCurrency(availableBalance, currentCurrency)}.`);
      return;
    }

    if (sourceVault === targetVault) {
      setError("Source and Target vaults cannot be identical.");
      return;
    }

    if (isBreachingReserveThreshold && !safetyOverrideAcknowledged) {
      setError("Runway Breach Guard active. Acknowledge the emergency threshold override before executing.");
      return;
    }

    onTransfer({
      sourceVault,
      targetVault,
      amount: numAmt,
      note: note.trim() || "Internal Capital Re-allocation",
      timestamp: Date.now()
    });

    onClose();
    setAmount("");
    setNote("");
    setError("");
    setSafetyOverrideAcknowledged(false);
  };

  const SourceIcon = VAULT_METAS[sourceVault].icon;
  const TargetIcon = VAULT_METAS[targetVault].icon;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px] bg-white border border-stone-200/90 rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] p-6 sm:p-7 z-10 select-none my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
                Capital Partitioning
              </span>
              <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-950 mt-0.5">
                Internal Vault Transfer
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

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Visual Route Strip */}
            <div className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${VAULT_METAS[sourceVault].color}`}>
                  <SourceIcon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-stone-400 block">From Vault</span>
                  <span className="text-xs font-mono font-bold text-zinc-900 truncate block">
                    {VAULT_METAS[sourceVault].label}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0 mx-1" />

              <div className="flex items-center gap-2.5 min-w-0 text-right">
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-stone-400 block">To Vault</span>
                  <span className="text-xs font-mono font-bold text-zinc-900 truncate block">
                    {VAULT_METAS[targetVault].label}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${VAULT_METAS[targetVault].color}`}>
                  <TargetIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Custom Dropdown Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <LuxuryVaultSelect
                label="Source Vault"
                value={sourceVault}
                onChange={handleSourceChange}
                options={["primary", "reserve", "growth"]}
                vaultBalances={vaultBalances}
                currentCurrency={currentCurrency}
                subtext={
                  <span>
                    Avail: <strong className="text-zinc-800">{formatCurrency(availableBalance, currentCurrency)}</strong>
                  </span>
                }
              />

              <LuxuryVaultSelect
                label="Target Vault"
                value={targetVault}
                onChange={(val) => {
                  setTargetVault(val);
                  setError("");
                }}
                options={["primary", "reserve", "growth"].filter((k) => k !== sourceVault)}
                vaultBalances={vaultBalances}
                currentCurrency={currentCurrency}
                subtext={
                  <span>
                    Cur: <strong className="text-zinc-800">{formatCurrency(vaultBalances[targetVault] || 0, currentCurrency)}</strong>
                  </span>
                }
              />
            </div>

            {/* Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Transfer Amount ({currentCurrency})
                </label>
                <div className="flex items-center gap-1.5">
                  {[0.25, 0.5, 1.0].map((fraction) => (
                    <button
                      key={fraction}
                      type="button"
                      onClick={() => setAmount(String(Math.floor(availableBalance * fraction)))}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                    >
                      {fraction === 1.0 ? "MAX" : `${fraction * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono font-bold text-stone-400">
                  $
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-2xl text-xl font-mono font-black text-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Safety Threshold Lock Warning Banner */}
            {isBreachingReserveThreshold && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2"
              >
                <div className="flex items-center gap-2 text-amber-800 text-xs font-mono font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Runway Breach Guard Active</span>
                </div>
                <p className="text-[11px] font-sans text-amber-700 leading-relaxed">
                  You are drawing over 50% of the Emergency Reserve buffer. This operation will compromise multi-quarter runway endurance.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={safetyOverrideAcknowledged}
                    onChange={(e) => setSafetyOverrideAcknowledged(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                  />
                  <span className="text-[10px] font-mono text-amber-900 font-semibold">
                    Authorize Reserve Threshold Override
                  </span>
                </label>
              </motion.div>
            )}

            {/* Memo Input */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Transfer Memo (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Monthly reserve partition"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50/80 border border-stone-200/90 rounded-xl text-xs font-sans text-zinc-950 focus:outline-none focus:border-orange-500 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-mono font-semibold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>Execute Transfer</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}