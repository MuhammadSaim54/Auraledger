import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  FileSpreadsheet,
  FileCode2,
  Printer,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportLedgerToCSV, exportStateBackupJSON, printAuditStatement } from "../utils/exporter";
import { CATEGORIES } from "../types/models";
import BotanicalCradle from "./BotanicalCradle";

export default function LedgerViewport({
  transactions = [],
  onDeleteTransaction,
  currentCurrency = "USD",
  currentUser,
  vaultTransfers = []
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Dropdown states
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const categoryDropdownRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Pipeline
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        (tx.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.merchant || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.tag || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || tx.category === selectedCategory;

      const matchesType =
        selectedType === "all" || tx.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  // Handlers
  const handleExportCSV = () => {
    const success = exportLedgerToCSV(
      filteredTransactions,
      currentCurrency,
      currentUser?.name || "Commander"
    );
    if (success) {
      showToast("CSV Audit Statement downloaded");
    } else {
      showToast("No transactions to export");
    }
    setIsExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    exportStateBackupJSON(currentUser, transactions, vaultTransfers);
    showToast("Sovereign JSON backup downloaded");
    setIsExportMenuOpen(false);
  };

  const handlePrintAudit = () => {
    const success = printAuditStatement(
      filteredTransactions,
      currentCurrency,
      currentUser?.name || "Commander"
    );
    if (!success) {
      showToast("No transactions to print");
    }
    setIsExportMenuOpen(false);
  };

  const activeCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") return "All Categories";
    const found = CATEGORIES.find((c) => c.id === selectedCategory);
    return found ? found.label : selectedCategory;
  }, [selectedCategory]);

  return (
    <div className="space-y-6 select-none font-sans relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 sm:right-6 z-[150] px-4 py-2.5 rounded-2xl bg-zinc-950 text-white font-mono text-xs shadow-2xl border border-white/15 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Header & Export Toolbar */}
      <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-[28px] bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
            Audit Ledger
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-950">
            Transaction Registry
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            {filteredTransactions.length} Verified Entries • 100% Client-Side Sovereignty
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 relative">
          <div className="relative w-full sm:w-auto">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Export Suite</span>
              <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isExportMenuOpen ? "rotate-180" : ""}`} />
            </motion.button>

            {isExportMenuOpen && (
              <div
                onClick={() => setIsExportMenuOpen(false)}
                className="fixed inset-0 z-[90] bg-transparent"
              />
            )}

            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-40px)] p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-stone-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-[100] space-y-1 font-mono text-xs"
                >
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="w-full px-3.5 py-2.5 rounded-xl text-left hover:bg-stone-50 flex items-center gap-3 text-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Export to CSV</p>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Spreadsheet Format</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="w-full px-3.5 py-2.5 rounded-xl text-left hover:bg-stone-50 flex items-center gap-3 text-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/60">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">JSON Cold Backup</p>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Full Sovereign State</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintAudit}
                    className="w-full px-3.5 py-2.5 rounded-xl text-left hover:bg-stone-50 flex items-center gap-3 text-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 border border-stone-200/80">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Print Statement</p>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Isolated Audit Report</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter & Search Matrix */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search descriptor, merchant, #tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200/90 text-xs font-mono text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
          />
        </div>

        {/* Custom Luxury Porcelain Category Dropdown */}
        <div ref={categoryDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
            className="w-full px-4 py-2.5 rounded-2xl bg-white border border-stone-200/90 text-xs font-mono text-zinc-800 flex items-center justify-between shadow-2xs hover:border-stone-300 transition-all cursor-pointer"
          >
            <span className="truncate">{activeCategoryLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1.5 p-1.5 rounded-2xl bg-white border border-stone-200 shadow-xl z-50 max-h-60 overflow-y-auto space-y-0.5 font-mono text-xs"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCategory === "all" ? "bg-orange-50 text-orange-700 font-bold" : "hover:bg-stone-50 text-zinc-800"
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === "all" && <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
                </button>

                {CATEGORIES.map((c) => {
                  const isSelected = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? "bg-orange-50 text-orange-700 font-bold" : "hover:bg-stone-50 text-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: c.color || "#ea580c" }}
                        />
                        <span>{c.label}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100/80 border border-stone-200/80 text-xs font-mono shadow-2xs">
          {["all", "expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                selectedType === t
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-stone-500 hover:text-zinc-900"
              }`}
            >
              {t === "all" ? "All" : t === "expense" ? "Outflow" : "Inflow"}
            </button>
          ))}
        </div>
      </div>

      {/* BOTANICAL CRADLE WRAPPER: Leaves restoring luxury organic levitation */}
      <BotanicalCradle variant="emerald" floatDelay={0.2}>
        <div className="relative z-10 rounded-[32px] bg-white border border-stone-200/80 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-stone-400 font-mono text-xs">
              No entries matching active filters.
            </div>
          ) : (
            <>
              {/* 1. Mobile Adaptive Card List (No horizontal scrolling) */}
              <div className="block sm:hidden divide-y divide-stone-100 font-mono p-2">
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((tx) => {
                    const isInflow = tx.type === "income";

                    return (
                      <motion.div
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 hover:bg-stone-50/70 rounded-2xl transition-colors space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                isInflow
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : "bg-rose-50 text-rose-600 border-rose-200"
                              }`}
                            >
                              {isInflow ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                            </div>
                            <div className="truncate">
                              <h4 className="font-bold text-zinc-950 font-sans text-sm truncate">
                                {tx.title}
                              </h4>
                              <p className="text-[10px] text-stone-400 capitalize">
                                {tx.category} • {formatDate(tx.date)}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`font-black text-sm shrink-0 ${
                              isInflow ? "text-emerald-600" : "text-zinc-950"
                            }`}
                          >
                            {isInflow ? "+" : "-"}
                            {formatCurrency(tx.amount, currentCurrency)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1 text-stone-500 border-t border-dashed border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 capitalize">
                              {tx.vaultId || "primary"}
                            </span>
                            <span className="text-stone-400">{tx.tag || "#general"}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Purge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* 2. Desktop Full Matrix Table */}
              <div className="hidden sm:block overflow-x-auto no-scrollbar">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-400 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-5">Entry & Merchant</th>
                      <th className="py-3 px-4">Partition Vault</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Audit Tag</th>
                      <th className="py-3 px-4 text-right">Amount ({currentCurrency})</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <AnimatePresence mode="popLayout">
                      {filteredTransactions.map((tx) => {
                        const isInflow = tx.type === "income";

                        return (
                          <motion.tr
                            key={tx.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="hover:bg-stone-50/70 transition-colors group"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                                    isInflow
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      : "bg-rose-50 text-rose-600 border-rose-200"
                                  }`}
                                >
                                  {isInflow ? (
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ArrowDownRight className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-zinc-950 truncate font-sans text-sm">
                                    {tx.title}
                                  </p>
                                  <span className="text-[10px] text-stone-400 capitalize">
                                    {tx.category} • {tx.merchant || "Internal"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-stone-600">
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200/60 text-[10px] capitalize font-medium">
                                {tx.vaultId || "primary"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                              {formatDate(tx.date)}
                            </td>

                            <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                              {tx.tag || "#general"}
                            </td>

                            <td
                              className={`py-3.5 px-4 text-right font-black text-sm ${
                                isInflow ? "text-emerald-600" : "text-zinc-950"
                              }`}
                            >
                              {isInflow ? "+" : "-"}
                              {formatCurrency(tx.amount, currentCurrency)}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => onDeleteTransaction(tx.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                                title="Purge Transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </BotanicalCradle>
    </div>
  );
}