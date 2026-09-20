import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  ReceiptText,
  Lock,
  Flame,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  X,
  Zap,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Globe,
  Radio,
  ExternalLink
} from "lucide-react";

export default function LandingHero({ onOpenAuth }) {
  const containerRef = useRef(null);

  // Live Interactive Capital State
  const [balance, setBalance] = useState(248500);
  const [transactions, setTransactions] = useState([
    { id: 1, title: "AWS Compute Cluster H100", cat: "Infrastructure", amount: -482.50, type: "outflow", vault: "Operating" },
    { id: 2, title: "Stripe Enterprise Settlement", cat: "Treasury Inflow", amount: +14250.00, type: "inflow", vault: "Primary" },
    { id: 3, title: "Anthropic Claude API Batch", cat: "Inference", amount: -89.40, type: "outflow", vault: "R&D Lab" }
  ]);

  // High Precision Pointer Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 85, damping: 24, mass: 0.75 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const cardRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const cardRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const leafTopX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const leafTopY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const leafBottomX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
  const leafBottomY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSimulateInflow = () => {
    const samples = [
      { title: "Client Sovereign Retainer", cat: "Retainer", amount: +8500.00, type: "inflow", vault: "Primary" },
      { title: "Supabase Cloud Enterprise", cat: "Database", amount: -120.00, type: "outflow", vault: "Operating" },
      { title: "Figma Organization Seat", cat: "Tooling", amount: -45.00, type: "outflow", vault: "Lab" }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const newTx = {
      id: Date.now(),
      title: picked.title,
      cat: picked.cat,
      amount: picked.amount,
      type: picked.type,
      vault: picked.vault
    };
    setTransactions((prev) => [newTx, ...prev.slice(0, 2)]);
    setBalance((prev) => prev + picked.amount);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen w-full bg-[#fbf9f5] text-zinc-950 flex flex-col justify-between relative overflow-x-hidden select-none font-sans"
    >
      {/* 1. ARCHITECTURAL LIVING AURA LIGHT */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Terracotta Solar Flare */}
        <motion.div
          animate={{
            scale: [1, 1.22, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.32, 0.5, 0.32]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-[8%] w-[850px] h-[850px] bg-gradient-to-bl from-orange-400/30 via-amber-200/20 to-transparent rounded-full blur-[140px]"
        />

        {/* Bioluminescent Emerald Breath */}
        <motion.div
          animate={{
            scale: [1.12, 0.95, 1.12],
            x: [0, -40, 0],
            y: [0, 35, 0],
            opacity: [0.22, 0.4, 0.22]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] -left-40 w-[780px] h-[780px] bg-gradient-to-tr from-emerald-400/25 via-teal-200/15 to-transparent rounded-full blur-[140px]"
        />

        {/* Precision Sub-Pixel Architectural Grid */}
        <div
          className="absolute inset-0 opacity-[0.026]"
          style={{
            backgroundImage: `linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)`,
            backgroundSize: "36px 36px"
          }}
        />
      </div>

      {/* 2. CHASSIS MINIMALIST NAVBAR (Level-Up Luxury Porcelain Pill) */}
      <header className="sticky top-0 z-50 w-full pt-4 px-3 sm:px-8 max-w-[1450px] mx-auto transition-all">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-3 py-2.5 px-4 sm:px-7 rounded-full bg-white/80 backdrop-blur-2xl border border-stone-200/80 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06),0_1px_1.5px_rgba(255,255,255,1)_inset] hover:border-stone-300/80 transition-all group"
        >
          {/* Logo Mark with Caustic Halo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative w-9 h-9 rounded-2xl bg-gradient-to-b from-[#2a1308] to-[#120703] p-[1px] shadow-sm shadow-orange-950/20"
            >
              <div className="w-full h-full rounded-[15px] bg-[#170b05] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/40 via-transparent to-amber-400/20" />
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-orange-500 relative z-10" fill="none">
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M12 3V12M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-zinc-950 leading-none">AuraLedger</h1>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">Tactile FinOS</p>
            </div>
          </div>

          {/* Center Micro-Status Pill (Subtle & Sleek) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/70 border border-stone-200/60 text-[11px] font-mono text-stone-600 shadow-2xs hover:bg-stone-100 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>Telemetry: <strong className="text-zinc-900 font-semibold">0ms Local Sandbox</strong></span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-400">v5.2 Kinetic</span>
          </div>

          {/* Action Deck */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth("signin")}
              className="px-4 py-2 rounded-full text-xs font-mono font-bold text-zinc-700 hover:text-zinc-950 hover:bg-stone-100/60 transition-all cursor-pointer"
            >
              Sign In
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="relative px-5 py-2 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-mono font-bold shadow-md shadow-zinc-950/20 flex items-center gap-2 transition-all cursor-pointer overflow-hidden group"
            >
              {/* Traveling Shimmer Line */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
              />
              <span className="relative z-10">Launch Terminal</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* 3. HERO STAGE */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-20">
        
        <div className="text-center flex flex-col items-center max-w-4xl mx-auto">
          {/* Luminous Tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-2xs text-[11px] font-mono mb-5 text-stone-600"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous Capital Operating System</span>
            <span className="text-stone-300">•</span>
            <span className="text-orange-600 font-bold flex items-center gap-1">
              Phase 5 Sovereign <ChevronRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Masterpiece Editorial Display Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] text-zinc-950 leading-[1.05] max-w-4xl"
          >
            Every Single Dollar Tracked. <br />
            <span className="bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
              Zero Spreadsheets. Zero Leaks.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-sm sm:text-lg text-stone-500 max-w-2xl font-normal leading-relaxed tracking-tight"
          >
            Stop wrestling with clumsy Excel sheets and broken bank connections. AuraLedger delivers tactile financial certainty with real-time daily burn velocity, automated multi-vault partitions, and local encrypted custody.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-105 text-white font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-orange-600/30 active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
              />
              <Plus className="w-4 h-4 text-orange-200" />
              <span>RECORD FIRST EXPENSE</span>
              <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleSimulateInflow}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-zinc-900 font-mono font-semibold text-xs tracking-wide shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500 group-hover:scale-125 transition-transform" />
              <span>SIMULATE LIVE INGESTION</span>
            </button>
          </motion.div>
        </div>

        {/* 4. THE $20,000 ARCHITECTURAL BOTANICAL CRADLE TELEMETRY CHASSIS */}
        <div className="relative mt-16 sm:mt-24 max-w-5xl mx-auto isolate select-none [perspective:1400px]">
          
          {/* Top-Left Sculptural Emerald Leaf */}
          <motion.div
            style={{ x: leafTopX, y: leafTopY }}
            animate={{
              y: [-4, 5, -4],
              rotate: [-20, -26, -20]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-6 sm:-left-10 w-28 sm:w-36 h-36 sm:h-48 pointer-events-none -z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
          >
            <svg viewBox="0 0 100 130" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="landingEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#10b981" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="landingVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M50 5 C75 25, 95 65, 80 115 C55 125, 20 100, 15 65 C12 35, 30 15, 50 5 Z"
                fill="url(#landingEmeraldGrad)"
                className="backdrop-blur-md"
              />
              <path d="M50 8 C52 45, 54 85, 50 118" stroke="url(#landingVeinGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M50 40 Q68 45, 78 55" stroke="url(#landingVeinGrad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              <path d="M50 65 Q30 70, 24 82" stroke="url(#landingVeinGrad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
          </motion.div>

          {/* Bottom-Right Root Vine Leaf */}
          <motion.div
            style={{ x: leafBottomX, y: leafBottomY }}
            animate={{
              y: [4, -5, 4],
              rotate: [15, 20, 15]
            }}
            transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -bottom-10 -right-6 sm:-right-8 w-32 sm:w-42 h-38 sm:h-52 pointer-events-none -z-10 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
          >
            <svg viewBox="0 0 120 150" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="landingAmberGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#fffbeb" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M60 140 C20 125, 10 75, 25 30 C45 10, 85 15, 95 50 C105 85, 90 125, 60 140 Z"
                fill="url(#landingAmberGrad)"
                className="backdrop-blur-md"
              />
              <path d="M60 138 C58 95, 55 55, 58 20" stroke="url(#landingVeinGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M58 50 Q40 55, 30 65" stroke="url(#landingVeinGrad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              <path d="M58 80 Q75 88, 85 98" stroke="url(#landingVeinGrad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
          </motion.div>

          {/* Main Levitating Monolith Chassis */}
          <motion.div
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d"
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[36px] sm:rounded-[44px] bg-white/95 backdrop-blur-2xl border border-white/95 p-6 sm:p-9 shadow-[0_30px_85px_-20px_rgba(0,0,0,0.08),0_1px_1px_rgba(255,255,255,0.95)_inset] overflow-hidden"
          >
            {/* Running Caustic Prism Line */}
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden p-[1px]">
              <motion.div
                animate={{ x: ["-150%", "250%"] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-orange-400/25 to-transparent skew-x-12"
              />
            </div>

            {/* Header Telemetry Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-stone-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono text-stone-400 ml-1">
                  auraledger.engine • Kinetic Multi-Vault Telemetry
                </span>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Retained Runway
              </span>
            </div>

            {/* Three Monolith Slabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-stone-400 block">Total Liquidity</span>
                <h4 className="text-2xl font-mono font-black text-zinc-950 mt-1">
                  ${balance.toLocaleString()}.00
                </h4>
                <p className="text-[10px] font-mono text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% this cycle
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-stone-400 block">Safe Daily Pace</span>
                <h4 className="text-2xl font-mono font-black text-zinc-950 mt-1">
                  $214.50<span className="text-xs font-normal text-stone-400">/day</span>
                </h4>
                <p className="text-[10px] font-mono text-orange-600 font-bold mt-1.5 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 52.5 Mo Horizon
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-stone-400 block">Reserve Fund</span>
                <h4 className="text-2xl font-mono font-black text-zinc-950 mt-1">
                  30% Protected
                </h4>
                <p className="text-[10px] font-mono text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Jan 2031 Depletion
                </p>
              </div>
            </div>

            {/* Live Interactive Ingest Feed */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-2.5 border-b border-stone-100 mb-2.5">
                <span>RECENT REAL-TIME INGEST STREAM</span>
                <button
                  type="button"
                  onClick={handleSimulateInflow}
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Push Mock Tx
                </button>
              </div>

              <div className="divide-y divide-stone-100 font-mono text-xs">
                <AnimatePresence mode="popLayout">
                  {transactions.map((tx) => {
                    const isInflow = tx.type === "inflow";

                    return (
                      <motion.div
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            isInflow ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}>
                            {isInflow ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-zinc-900 truncate">{tx.title}</p>
                            <span className="text-[9px] text-stone-400">#{tx.cat.toLowerCase()} • {tx.vault}</span>
                          </div>
                        </div>

                        <span className={`font-black shrink-0 ${isInflow ? "text-emerald-600" : "text-zinc-950"}`}>
                          {isInflow ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. COMPARISON MATRIX (Ceramic Alabaster Slabs) */}
        <div className="mt-20 sm:mt-28">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 font-bold">
              The Architecture Shift
            </span>
            <p className="text-2xl sm:text-4xl font-extrabold text-zinc-950 mt-1.5 tracking-[-0.03em]">
              Why High-Growth Builders Abandon Spreadsheets
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 px-2 font-normal leading-relaxed">
              Traditional expense apps track money after it is already lost. AuraLedger calculates real-time daily burn velocity to prevent runway exhaustion before it happens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {/* Traditional Card */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-white/80 backdrop-blur-xl border border-rose-200/60 shadow-[0_15px_40px_-15px_rgba(244,63,94,0.06)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-[11px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                  Traditional Spreadsheets & Trackers
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                Fragile, Leaky & Tedious
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">Formulas Break:</strong> Multi-currency conversions and tax partitions ruin spreadsheet cells unpredictably.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">Mobile Friction:</strong> Adding an expense on mobile is clumsy and gets abandoned after three days.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">Cloud Profiling:</strong> Consumer budget apps monetize your spending habits with third-party advertisers.</span>
                </li>
              </ul>
            </div>

            {/* AuraLedger Card */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-white/90 backdrop-blur-xl border border-emerald-300/60 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.1)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                  The AuraLedger Standard
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                Tactile, Deterministic & Sovereign
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">1-Click Fast Ingestion:</strong> Record expenses in under 3 seconds with category tags and vault routing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">Predictive Daily Burn:</strong> Real-time burn pacing calculates safe daily velocity to safeguard reserves.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong className="text-zinc-900">100% Client-Side Sovereignty:</strong> All transactions live encrypted in your browser. Zero server leaks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. CLEAN CTA MONOLITH */}
        <div className="mt-20 sm:mt-28 rounded-[36px] bg-gradient-to-b from-[#180e07] via-[#0f0703] to-[#050201] text-white p-8 sm:p-14 relative overflow-hidden shadow-xl shadow-orange-950/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-[10px] sm:text-xs font-mono text-orange-400 font-bold uppercase tracking-widest block">
              Instant Provisioning
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight leading-tight">
              Ready to Master Your Expense Velocity?
            </h2>
            <p className="text-xs sm:text-base text-stone-300 font-sans leading-relaxed pt-1">
              Zero credit card required. Launch your encrypted, client-side expense tracker in less than 30 seconds.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth("signup")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>GET STARTED FREE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("signin")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-mono font-semibold backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                Sign In to Vault
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 7. THE $20,000 ARCHITECTURAL MONOLITH FOOTER (Elevated Luxury Experience) */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full pt-10 pb-12 px-4 sm:px-8 max-w-[1450px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[40px] bg-white/85 backdrop-blur-2xl border border-stone-200/80 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.06),0_1px_1.5px_rgba(255,255,255,1)_inset] p-8 sm:p-12 overflow-hidden relative"
        >
          {/* Subtle Ambient Caustic Light Sweep across Footer Top */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent pointer-events-none" />

          {/* Top Row: Brand & Architectural Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 sm:gap-12 pb-10 border-b border-stone-100">
            
            {/* Brand Manifesto Column (Span 2) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-zinc-950 text-white flex items-center justify-center p-[1px] shadow-sm shadow-zinc-950/20">
                  <div className="w-full h-full rounded-[15px] bg-[#140803] flex items-center justify-center border border-orange-500/20">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-orange-500" fill="none">
                      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M12 3V12M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-zinc-950 font-mono">AuraLedger</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Autonomous FinOS</p>
                </div>
              </div>

              <p className="text-xs text-stone-500 font-sans leading-relaxed max-w-sm">
                The high-velocity tactile personal finance operating system. Built for sovereign operators, founders, and creators who demand absolute privacy and zero cloud profiling.
              </p>

              {/* Verified Protocol Badges */}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200/80 flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  AES-256 Vault Sandboxing
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200/80 flex items-center gap-1.5 shadow-2xs">
                  <Lock className="w-3 h-3 text-orange-600" />
                  Zero Telemetry
                </span>
              </div>
            </div>

            {/* Column 2: System HUD */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-950">
                Core Modules
              </h4>
              <ul className="space-y-2 text-xs font-mono text-stone-500">
                {[
                  { label: "Executive HUD", action: () => onOpenAuth("signin") },
                  { label: "Omni Ledger", action: () => onOpenAuth("signin") },
                  { label: "Cashflow Matrix", action: () => onOpenAuth("signin") },
                  { label: "Multi-Vault Registry", action: () => onOpenAuth("signin") }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="hover:text-zinc-950 hover:translate-x-1 flex items-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <span className="w-1 h-1 rounded-full bg-stone-300 group-hover:bg-orange-500 transition-colors" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Architecture Protocol */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-950">
                Architecture
              </h4>
              <ul className="space-y-2 text-xs font-mono text-stone-500">
                {[
                  { label: "Client Isolation", action: () => onOpenAuth("signin") },
                  { label: "Kinetic Partition Engine", action: () => onOpenAuth("signin") },
                  { label: "Autonomous Equilibrium", action: () => onOpenAuth("signin") },
                  { label: "Runway Breach Guard", action: () => onOpenAuth("signin") }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="hover:text-zinc-950 hover:translate-x-1 flex items-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <span className="w-1 h-1 rounded-full bg-stone-300 group-hover:bg-emerald-500 transition-colors" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Engine Diagnostics */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-950">
                Telemetry
              </h4>
              <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Nominal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Engine:</span>
                  <span className="text-zinc-800 font-semibold">React 19 Core</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Latency:</span>
                  <span className="text-orange-600 font-bold">0.02ms Local</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Legal, Sovereignty & High-Tech Status Pill */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <span>© 2026 AuraLedger OS.</span>
              <span className="text-stone-300">•</span>
              <span>All rights reserved.</span>
            </div>

            {/* High-Contrast Luxury Telemetry Pill */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/80 text-stone-600 flex items-center gap-1.5 text-[11px] font-semibold">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Deterministic Engine Active</span>
              </span>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}