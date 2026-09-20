import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Server, 
  Layers, 
  Cpu, 
  Home, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Building2,
  FileSpreadsheet,
  Inbox
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const CATEGORY_MAP = {
  servers: { label: "GPU & Cloud", icon: Server, color: "text-orange-600 bg-orange-50 border-orange-200" },
  saas: { label: "SaaS & AI APIs", icon: Layers, color: "text-sky-600 bg-sky-50 border-sky-200" },
  hardware: { label: "Hardware & R&D", icon: Cpu, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  living: { label: "Ops & Living", icon: Home, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  misc: { label: "Discretionary", icon: Briefcase, color: "text-stone-600 bg-stone-50 border-stone-200" },
  freelance: { label: "Client Retainers", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  investment: { label: "Capital Inflow", icon: TrendingUp, color: "text-teal-600 bg-teal-50 border-teal-200" },
  saas_sales: { label: "Product ARR", icon: Layers, color: "text-amber-600 bg-amber-50 border-amber-200" },
  misc_inc: { label: "Other Liquidity", icon: DollarSign, color: "text-blue-600 bg-blue-50 border-blue-200" }
};

const VAULT_NAMES = {
  primary: "Primary Operating",
  reserve: "Emergency Reserve",
  growth: "Growth & Lab"
};

export default function LedgerViewport({ 
  transactions = [], 
  onDeleteTransaction, 
  currentCurrency = "USD" 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'income' | 'expense'

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = filterType === "all" || tx.type === filterType;
      const desc = (tx.description || "").toLowerCase();
      const cat = (tx.category || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || desc.includes(q) || cat.includes(q) || String(tx.amount).includes(q);
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ["ID", "Type", "Amount", "Currency", "Category", "Vault", "Description", "Date"];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.amount,
      currentCurrency,
      t.category,
      t.vaultId || "primary",
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.date
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AuraLedger_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 select-none"
    >
      {/* Top Filter and Search Control Deck */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white border border-stone-200/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search memo, category, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50/70 border border-stone-200/80 rounded-xl text-xs font-mono text-zinc-950 focus:outline-none focus:border-orange-500 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Filter Tabs & Export Button */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          <div className="flex p-0.5 rounded-xl bg-stone-100/90 border border-stone-200/60 shadow-inner">
            {[
              { id: "all", label: "All" },
              { id: "income", label: "Inflow" },
              { id: "expense", label: "Outflow" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  filterType === tab.id ? "text-zinc-950 font-bold" : "text-stone-500 hover:text-zinc-900"
                }`}
              >
                {filterType === tab.id && (
                  <motion.div
                    layoutId="active-ledger-filter"
                    className="absolute inset-0 rounded-lg bg-white shadow-xs border border-stone-200/60"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-xs font-mono font-semibold text-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Container (Desktop View) */}
      <div className="hidden md:block rounded-[28px] bg-white border border-stone-200/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-mono uppercase tracking-wider text-stone-400">
              <th className="py-3 px-5">Classification</th>
              <th className="py-3 px-5">Description & Memo</th>
              <th className="py-3 px-5">Vault Route</th>
              <th className="py-3 px-5">Effective Date</th>
              <th className="py-3 px-5 text-right">Magnitude</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100/80 font-mono text-xs">
            {filteredTransactions.map((tx) => {
              const catMeta = CATEGORY_MAP[tx.category] || CATEGORY_MAP.misc;
              const Icon = catMeta.icon;
              const isIncome = tx.type === "income";
              const formattedDate = new Date(tx.date || tx.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors group">
                  {/* Category Chip */}
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${catMeta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{catMeta.label}</span>
                    </span>
                  </td>

                  {/* Memo */}
                  <td className="py-3.5 px-5 font-sans font-medium text-zinc-900 max-w-xs truncate">
                    {tx.description || (isIncome ? "Capital Influx" : "Capital Outflow")}
                  </td>

                  {/* Vault */}
                  <td className="py-3.5 px-5 text-stone-500">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <Building2 className="w-3 h-3 text-stone-400" />
                      <span>{VAULT_NAMES[tx.vaultId] || "Operating Vault"}</span>
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 text-stone-400 text-[11px]">
                    {formattedDate}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-5 text-right font-black">
                    <span className={`inline-flex items-center gap-0.5 ${isIncome ? "text-emerald-600" : "text-zinc-950"}`}>
                      {isIncome ? "+" : "-"}{formatCurrency(tx.amount, currentCurrency)}
                    </span>
                  </td>

                  {/* Delete Action */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteTransaction && onDeleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center">
            <Inbox className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-mono uppercase tracking-wider text-stone-400">No Transactions Found</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Try altering your filter query or record a new transaction.</p>
          </div>
        )}
      </div>

      {/* Card List Container (Mobile & Tablet View) */}
      <div className="block md:hidden space-y-2.5">
        {filteredTransactions.map((tx) => {
          const catMeta = CATEGORY_MAP[tx.category] || CATEGORY_MAP.misc;
          const Icon = catMeta.icon;
          const isIncome = tx.type === "income";
          const formattedDate = new Date(tx.date || tx.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          });

          return (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${catMeta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-zinc-950 font-sans truncate">
                    {tx.description || (isIncome ? "Capital Influx" : "Capital Outflow")}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">
                    {formattedDate} • {VAULT_NAMES[tx.vaultId] || "Operating Vault"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-xs font-mono font-black ${isIncome ? "text-emerald-600" : "text-zinc-950"}`}>
                  {isIncome ? "+" : "-"}{formatCurrency(tx.amount, currentCurrency)}
                </p>
                <button
                  type="button"
                  onClick={() => onDeleteTransaction && onDeleteTransaction(tx.id)}
                  className="text-[10px] font-mono text-stone-300 hover:text-rose-600 transition-colors mt-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="py-12 rounded-2xl bg-white border border-stone-200/80 text-center">
            <Inbox className="w-7 h-7 text-stone-300 mx-auto mb-1.5" />
            <p className="text-xs font-mono uppercase tracking-wider text-stone-400">No Transactions Found</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}