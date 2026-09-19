import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  TrendingDown, 
  TrendingUp,
  Clock, 
  Wallet,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Plus,
  Flame
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import AntiGravityCanvas from "./AntiGravityCanvas";

// Motion Variants for Staggered Choreography
const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function HeroDeck({ 
  userProfile, 
  currentCurrency, 
  transactions = [], 
  onOpenNewTransaction 
}) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const firstName = userProfile?.name ? userProfile.name.split(" ")[0] : "Commander";

  const { totalOutflow, netBalance } = useMemo(() => {
    let inflow = userProfile?.startingBalance || 0;
    let outflow = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") inflow += tx.amount;
      if (tx.type === "expense") outflow += tx.amount;
    });

    return {
      totalOutflow: outflow,
      netBalance: inflow - outflow
    };
  }, [transactions, userProfile]);

  const daysInMonth = 30;
  const currentDay = new Date().getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay);
  const safeDailySpend = Math.max(0, netBalance / daysRemaining);

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-3 sm:mt-5 mb-6 sm:mb-8 select-none"
    >
      {/* High-End Terracotta Command Deck Container */}
      <div className="relative rounded-3xl sm:rounded-[32px] p-5 sm:p-7 md:p-8 lg:p-10 overflow-hidden bg-gradient-to-br from-[#9c3214] via-[#c2410c] to-[#e05309] text-white shadow-[0_20px_50px_-15px_rgba(194,65,12,0.38)] border border-orange-400/25">
        
        {/* Anti-Gravity Spotlight Dot Matrix */}
        <AntiGravityCanvas />

        {/* Ambient Warm Radial Lights */}
        <div className="absolute top-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-52 md:w-72 h-52 md:h-72 bg-black/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-6">
          
          {/* Left Column: Greeting, Telemetry Badges & Narrative */}
          <div className="space-y-3 max-w-xl">
            
            {/* Horizontal Pill Track with Individual Micro-Animations */}
            <motion.div variants={itemVariants} className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-black/35 backdrop-blur-md text-orange-200 border border-white/10 shrink-0 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vault Online</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono text-orange-100 bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
                <Clock className="w-3 h-3 text-orange-200" />
                <span>{daysRemaining}d Cycle</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono text-amber-200 bg-black/25 backdrop-blur-md border border-amber-300/20 shrink-0">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Runway: Optimal</span>
              </span>
            </motion.div>

            {/* Typography Section */}
            <motion.div variants={itemVariants}>
              <p className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-orange-200/90 font-medium">
                {greeting},
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans mt-0.5">
                {firstName}<span className="text-amber-300 font-serif">.</span>
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-orange-100/90 mt-1 sm:mt-1.5 leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                Continuous liquidity orchestration, automated burn pacing, and real-time ledger intelligence.
              </p>
            </motion.div>
          </div>

          {/* Right Action: Fast Ingest Entry with Tactile Haptics */}
          <motion.div variants={itemVariants} className="shrink-0 w-full md:w-auto">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              onClick={onOpenNewTransaction}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-2xl bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-[0_12px_30px_rgba(0,0,0,0.35)] cursor-pointer group border border-white/15"
            >
              <Plus className="w-4 h-4 text-orange-400 stroke-[3]" />
              <span>Fast Ingest Entry</span>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3 text-orange-300" />
              </div>
            </motion.button>
          </motion.div>

        </div>

        {/* Lower Row: Glass KPI Cards with Dynamic Lift */}
        <motion.div 
          variants={itemVariants}
          className="relative z-10 mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5"
        >
          {/* Card 1: Net Liquidity */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15 shadow-inner flex items-center justify-between cursor-default"
          >
            <div>
              <div className="flex items-center gap-1.5 text-orange-200/85">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Net Liquidity</span>
              </div>
              <motion.p 
                key={netBalance}
                initial={{ opacity: 0.7, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl font-black font-mono text-white mt-1 tracking-tight"
              >
                {formatCurrency(netBalance, currentCurrency)}
              </motion.p>
              <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Live Encrypted
              </span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 ml-2">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-200" />
            </div>
          </motion.div>

          {/* Card 2: Total Outflow */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15 shadow-inner flex items-center justify-between cursor-default"
          >
            <div>
              <div className="flex items-center gap-1.5 text-orange-200/85">
                <TrendingDown className="w-3.5 h-3.5 text-rose-300" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Total Outflow</span>
              </div>
              <motion.p 
                key={totalOutflow}
                initial={{ opacity: 0.7, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl font-black font-mono text-white mt-1 tracking-tight"
              >
                {formatCurrency(totalOutflow, currentCurrency)}
              </motion.p>
              <span className="text-[10px] font-mono text-rose-200 flex items-center gap-1 mt-0.5">
                Cycle Expenses
              </span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 ml-2">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
            </div>
          </motion.div>

          {/* Card 3: Safe Daily Burn Rate */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.012 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="sm:col-span-2 lg:col-span-1 p-3.5 sm:p-4 md:p-5 rounded-2xl bg-amber-400/20 backdrop-blur-xl border border-amber-300/30 shadow-inner flex items-center justify-between cursor-default"
          >
            <div>
              <div className="flex items-center gap-1.5 text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Safe Daily Burn</span>
              </div>
              <motion.p 
                key={safeDailySpend}
                initial={{ opacity: 0.7, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl font-black font-mono text-white mt-1 tracking-tight"
              >
                {formatCurrency(safeDailySpend, currentCurrency)}
                <span className="text-xs font-normal text-orange-200">/day</span>
              </motion.p>
              <span className="text-[10px] font-mono text-amber-200 flex items-center gap-1 mt-0.5 font-medium">
                Pacing: Optimal
              </span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-white shrink-0 ml-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            </div>
          </motion.div>

        </motion.div>

      </div>
    </motion.section>
  );
}