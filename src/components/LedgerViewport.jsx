import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Download, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Building2,
  ShieldCheck
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import BotanicalCradle from "./BotanicalCradle";

const VAULT_BADGES = {
  primary: { label: "Operating", icon: Building2, color: "text-orange-600 bg-orange-50 border-orange-200" },
  reserve: { label: "Reserve", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  growth: { label: "Growth", icon: Sparkles, color: "text-amber-600 bg-amber-50 border-amber-200" }
};

export default function LedgerViewport({
  transactions = [],
  onDeleteTransaction,
  currentCurrency = "USD"
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = (tx.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        (tx.category || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, typeFilter]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["ID,Date,Description,Type,Category,Vault,Amount"];
    const rows = filtered.map(t => 
      `"${t.id}","${t.date || t.timestamp}","${t.description.replace(/"/g, '""')}","${t.type}","${t.category}","${t.vaultId || 'primary'}","${t.amount}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auraledger_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative space-y-8 select-none pb-28 [perspective:1400px]">
      {/* 1. Header Bar */}
      <div className="p-6 sm:p-7 rounded-[36px] bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
              Audit Stream
            </span>
            <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-orange-500 animate-pulse" /> Live Ledger Journal
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-950 mt-1.5">
            Transaction Registry
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Immutable log of all operational inflows, drains, and capital shifts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200/90 text-stone-700 hover:text-zinc-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-3.5 sm:p-4 rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_15px_35px_-12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions, tags, memo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-stone-50/80 border border-stone-200/80 rounded-xl text-xs font-mono text-zinc-900 focus:outline-none focus:border-orange-500 transition-all placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono capitalize transition-all cursor-pointer border ${
                typeFilter === t
                  ? "bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs"
                  : "bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-stone-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Ledger Table Cradled with Botanical Leaves */}
      <BotanicalCradle variant="emerald" floatDelay={0.2}>
        <div className="p-6 sm:p-8 rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06),0_0_30px_rgba(255,255,255,0.9)_inset] overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
              Showing {filtered.length} of {transactions.length} Entries
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="divide-y divide-stone-100 mt-2 font-mono">
              {filtered.map((tx) => {
                const isIncome = tx.type === "income";
                const vaultMeta = VAULT_BADGES[tx.vaultId] || VAULT_BADGES.primary;
                const VaultIcon = vaultMeta.icon;

                return (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isIncome 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200/60" 
                          : "bg-rose-50 text-rose-600 border-rose-200/60"
                      }`}>
                        {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-orange-600 transition-colors">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
                          <span className="capitalize">{tx.category || "General"}</span>
                          <span>•</span>
                          <span>{new Date(tx.date || tx.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-stone-500">
                            <VaultIcon className="w-2.5 h-2.5" />
                            {vaultMeta.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-black font-mono ${isIncome ? "text-emerald-600" : "text-zinc-950"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount, currentCurrency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction && onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center text-xs font-mono text-stone-400">
              No transactions matching query.
            </div>
          )}
        </div>
      </BotanicalCradle>
    </div>
  );
}