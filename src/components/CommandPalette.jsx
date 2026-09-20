import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Compass,
  ReceiptText,
  LineChart,
  Vault,
  Plus,
  Download,
  Upload,
  KeyRound,
  DollarSign,
  Coins,
  ArrowRight,
  Command,
  CornerDownLeft
} from "lucide-react";
import { CURRENCIES } from "../types/models";

export default function CommandPalette({
  isOpen,
  onClose,
  setActiveTab,
  onOpenNewTransaction,
  onOpenRestore,
  onOpenChangePassword,
  setCurrentCurrency,
  currentCurrency
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const ACTIONS = useMemo(() => [
    // Navigation
    { id: "nav-dash", title: "Jump to Dashboard", category: "Navigation", icon: Compass, shortcut: "D", run: () => setActiveTab("dashboard") },
    { id: "nav-ledger", title: "Jump to Audit Ledger", category: "Navigation", icon: ReceiptText, shortcut: "L", run: () => setActiveTab("ledger") },
    { id: "nav-analytics", title: "Jump to Analytics Forecaster", category: "Navigation", icon: LineChart, shortcut: "A", run: () => setActiveTab("analytics") },
    { id: "nav-vaults", title: "Jump to Multi-Vault Engine", category: "Navigation", icon: Vault, shortcut: "V", run: () => setActiveTab("vaults") },
    
    // Core Actions
    { id: "act-new", title: "Add New Inflow / Outflow Entry", category: "Actions", icon: Plus, shortcut: "N", run: onOpenNewTransaction },
    { id: "act-restore", title: "Restore Backup Archive (JSON)", category: "Actions", icon: Upload, shortcut: "R", run: onOpenRestore },
    { id: "act-pwd", title: "Change Tenant Password", category: "Account", icon: KeyRound, run: onOpenChangePassword },

    // Currency Switchers
    ...Object.keys(CURRENCIES).map((code) => ({
      id: `curr-${code}`,
      title: `Switch Currency to ${code} (${CURRENCIES[code].symbol})`,
      category: "Currency",
      icon: Coins,
      active: currentCurrency === code,
      run: () => setCurrentCurrency(code)
    }))
  ], [setActiveTab, onOpenNewTransaction, onOpenRestore, onOpenChangePassword, setCurrentCurrency, currentCurrency]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return ACTIONS;
    return ACTIONS.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [ACTIONS, query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Arrow navigation & Enter trigger
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredActions[selectedIndex];
      if (target) {
        target.run();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-start justify-center pt-16 sm:pt-28 px-4 select-none font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Spotlight Monolith */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ type: "spring", stiffness: 480, damping: 32 }}
        className="relative z-10 w-full max-w-xl rounded-[28px] bg-white/95 backdrop-blur-2xl border border-stone-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] overflow-hidden"
      >
        {/* Search Bar Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
          <Search className="w-5 h-5 text-orange-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, action, or view (or Esc to dismiss)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-mono text-zinc-950 placeholder:text-stone-400 focus:outline-none"
          />
          <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded-lg shrink-0">
            <span>ESC</span>
          </div>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 font-mono text-xs no-scrollbar">
          {filteredActions.length === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs">
              No commands matching "{query}"
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={action.id}
                  onClick={() => {
                    action.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-zinc-700 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected ? "bg-white/10 border-white/20 text-orange-400" : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold truncate">{action.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {action.shortcut && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border ${
                        isSelected ? "bg-white/20 text-white border-white/30" : "bg-stone-100 text-stone-500 border-stone-200"
                      }`}>
                        {action.shortcut}
                      </span>
                    )}
                    {action.active && (
                      <span className="text-[10px] font-bold text-orange-500">Active</span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span className="text-orange-600 font-bold">AuraLedger FinOS v2.4</span>
        </div>
      </motion.div>
    </div>
  );
}