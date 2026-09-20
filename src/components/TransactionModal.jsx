import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Minus, 
  Server, 
  Layers, 
  Cpu, 
  Home, 
  Briefcase, 
  TrendingUp, 
  Check, 
  Calendar as CalendarIcon, 
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles
} from "lucide-react";

const EXPENSE_CATEGORIES = [
  { id: "servers", label: "GPU & Cloud", icon: Server },
  { id: "saas", label: "SaaS & AI APIs", icon: Layers },
  { id: "hardware", label: "Hardware & R&D", icon: Cpu },
  { id: "living", label: "Ops & Living", icon: Home },
  { id: "misc", label: "Discretionary", icon: Briefcase }
];

const INCOME_CATEGORIES = [
  { id: "freelance", label: "Client Retainers", icon: Briefcase },
  { id: "investment", label: "Capital Inflow", icon: TrendingUp },
  { id: "saas_sales", label: "Product ARR", icon: Layers },
  { id: "misc_inc", label: "Other Liquidity", icon: DollarSign }
];

const VAULT_OPTIONS = [
  { id: "primary", label: "Primary Operating Vault", tag: "Liquid", icon: Building2 },
  { id: "reserve", label: "Emergency Reserve", tag: "Locked", icon: ShieldCheck },
  { id: "growth", label: "Growth & Lab Capital", tag: "Yield", icon: Sparkles }
];

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentCurrency = "USD" 
}) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("servers");
  const [targetVault, setTargetVault] = useState(VAULT_OPTIONS[0]);
  const [description, setDescription] = useState("");
  
  // Custom Popover States
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 20));
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 20));

  const vaultRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (vaultRef.current && !vaultRef.current.contains(e.target)) {
        setIsVaultOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const activeCategories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) return;

    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      amount: numAmt,
      category,
      vaultId: targetVault.id,
      description: description.trim() || (type === "expense" ? "Direct Capital Outflow" : "Capital Influx"),
      date: selectedDate.toISOString(),
      timestamp: Date.now()
    };

    onSubmit(newTx);
    onClose();
    
    setAmount("");
    setDescription("");
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  const monthName = viewDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const isToday = (day) => {
    const today = new Date(2026, 8, 20);
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const isSelected = (day) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
  };

  const handleSelectDay = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setIsDatePickerOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md"
        />

        {/* Modal Shell (Exact 2nd Image Layout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px] bg-white border border-stone-200/90 rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] p-6 sm:p-7 z-10 select-none my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                Ledger Ingestion
              </span>
              <h3 className="text-xl font-bold font-mono tracking-tight text-zinc-950 mt-0.5">
                Record Transaction
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
            {/* Flow Type Switcher */}
            <div className="flex p-1 rounded-2xl bg-stone-100/90 border border-stone-200/60 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  setCategory("servers");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === "expense"
                    ? "bg-white text-orange-700 shadow-xs border border-orange-500/20"
                    : "text-stone-500 hover:text-zinc-900"
                }`}
              >
                <Minus className="w-3.5 h-3.5 text-orange-600" />
                <span>Capital Outflow</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType("income");
                  setCategory("freelance");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === "income"
                    ? "bg-white text-emerald-700 shadow-xs border border-emerald-500/20"
                    : "text-stone-500 hover:text-zinc-900"
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Capital Inflow</span>
              </button>
            </div>

            {/* Amount Field */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
                Amount ({currentCurrency})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono font-bold text-stone-400">
                  {type === "expense" ? "-" : "+"}
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200/80 rounded-2xl text-xl font-mono font-black text-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Category Select Chips */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                Classification Category
              </label>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelectedCat = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSelectedCat
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route to Vault & Effective Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
              
              {/* Vault Dropdown */}
              <div ref={vaultRef} className="relative">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Route to Vault
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsVaultOpen(!isVaultOpen);
                    setIsDatePickerOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-xs font-mono font-medium text-zinc-900 flex items-center justify-between hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <targetVault.icon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{targetVault.label}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isVaultOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isVaultOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 bottom-full mb-1.5 z-50 bg-white border border-stone-200/90 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] p-1.5 space-y-1"
                    >
                      {VAULT_OPTIONS.map((v) => {
                        const Icon = v.icon;
                        const isChosen = targetVault.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setTargetVault(v);
                              setIsVaultOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isChosen ? "bg-orange-50 text-orange-950 font-bold" : "hover:bg-stone-50 text-stone-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${isChosen ? "text-orange-600" : "text-stone-400"}`} />
                              <span className="text-xs font-mono">{v.label}</span>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                              {v.tag}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Calendar Picker */}
              <div ref={dateRef} className="relative">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Effective Date
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsVaultOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-xs font-mono font-medium text-zinc-900 flex items-center justify-between hover:bg-stone-50 hover:border-stone-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isDatePickerOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDatePickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-full mb-1.5 z-50 w-64 bg-white border border-stone-200/90 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] p-3"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                        <span className="text-xs font-mono font-bold text-zinc-900">{monthName}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}
                            className="p-1 rounded-md hover:bg-stone-100 text-stone-500 cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}
                            className="p-1 rounded-md hover:bg-stone-100 text-stone-500 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mt-1.5 text-center">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d} className="text-[8px] font-mono font-bold text-stone-400 uppercase">{d}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-0.5 mt-1 text-center">
                        {Array.from({ length: startDay }).map((_, i) => (
                          <div key={`prev-${i}`} className="text-[10px] font-mono text-stone-300 py-1">
                            {prevMonthDays - startDay + 1 + i}
                          </div>
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const active = isSelected(dayNum);
                          const currentDayMarker = isToday(dayNum);

                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              onClick={() => handleSelectDay(dayNum)}
                              className={`py-1 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                                active
                                  ? "bg-orange-600 text-white shadow-xs font-bold"
                                  : currentDayMarker
                                  ? "border border-orange-500/40 text-orange-600 hover:bg-orange-50"
                                  : "text-zinc-800 hover:bg-stone-100"
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-stone-100 text-[9px] font-mono">
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date(2026, 8, 20);
                            setSelectedDate(now);
                            setViewDate(now);
                            setIsDatePickerOpen(false);
                          }}
                          className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                        >
                          Jump Today
                        </button>
                        <span className="text-stone-400">FinOS Sync</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Description Memo */}
            <div className="relative z-10">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Memo / Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., RunPod GPU cluster invoice #1042"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50/70 border border-stone-200/80 rounded-xl text-xs font-sans text-zinc-950 focus:outline-none focus:border-orange-500 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Actions (Exact 2nd image layout) */}
            <div className="flex items-center gap-2 pt-2 relative z-10">
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
                <span>Commit to Ledger</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}