import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    Lock,
    Globe,
    CheckCircle2,
    TrendingUp,
    CreditCard,
    FileSpreadsheet,
    Vault,
    ChevronRight,
    Wifi,
    Coins
} from "lucide-react";

export default function LandingHero({ onOpenAuth }) {
    return (
        <div className="min-h-screen w-full bg-[#fbfaf8] text-zinc-900 flex flex-col justify-between relative overflow-hidden select-none">

            {/* Dynamic Background: Mesh Glow & Subtle FinTech Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] bg-gradient-to-bl from-orange-400/20 via-amber-200/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[40%] left-[-10%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-gradient-to-tr from-amber-300/15 via-orange-100/25 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[10%] w-[450px] h-[450px] bg-gradient-to-tl from-orange-300/15 to-transparent rounded-full blur-3xl" />

                {/* Subtle Perspective Grid Matrix */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                    }}
                />
            </div>

            {/* Top Navbar: 100% Transparent Seamless Header */}
            <header className="relative z-40 w-full bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 flex items-center justify-between gap-2">

                    {/* Logo Mark */}
                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-[#2a1308] to-[#120703] p-[1px] shadow-sm shadow-orange-950/20">
                            <div className="w-full h-full rounded-[11px] bg-[#1a0c05] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none">
                                    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                    <path d="M12 3V12M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-sm sm:text-base font-bold tracking-tight text-zinc-950 leading-none">AuraLedger</h1>
                            <p className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-400 mt-0.5 uppercase">FinOS v2.4</p>
                        </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <button
                            onClick={() => onOpenAuth("signin")}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-medium text-zinc-700 hover:text-zinc-950 hover:bg-stone-200/40 transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => onOpenAuth("signup")}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Main Content Area */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-16 pb-16">

                {/* HERO HEADER */}
                <div className="text-center flex flex-col items-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-[11px] sm:text-xs font-mono font-semibold mb-4 sm:mb-6 shadow-xs"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        <span>Next-Gen Financial Architecture</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-zinc-950 leading-[1.12] sm:leading-[1.08]"
                    >
                        Master Your Liquidity. <br />
                        <span className="bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] bg-clip-text text-transparent">
                            Without Cloud Intrusion.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="mt-4 sm:mt-5 text-xs sm:text-base text-zinc-500 max-w-2xl leading-relaxed px-2 sm:px-0"
                    >
                        A high-velocity financial operating system engineered for creators, freelancers, and operators. Features sandboxed local tenant isolation, predictive daily spend burn-rate, and multi-currency liquidity tracking.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0"
                    >
                        <button
                            onClick={() => onOpenAuth("signup")}
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-110 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/25 active:scale-95 transition-all cursor-pointer group"
                        >
                            <span>Initialize Workspace</span>
                            <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => onOpenAuth("signin")}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/90 text-zinc-800 text-xs sm:text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                            <span>Existing Vault Access</span>
                        </button>
                    </motion.div>
                </div>

                {/* BESPOKE FLOATING FINANCIAL CARDS & MAGNETIC BEAM SCENE */}
                <div className="relative mt-12 sm:mt-16 max-w-4xl mx-auto h-[260px] sm:h-[340px] flex items-center justify-center">

                    {/* Ambient Magnetic Beam Ring */}
                    <div className="absolute w-[280px] sm:w-[480px] h-[140px] sm:h-[220px] rounded-full border border-orange-500/25 bg-gradient-to-b from-orange-400/10 to-transparent blur-xs pointer-events-none transform -rotate-6" />

                    {/* Card 1: Primary Obsidian Vault Card (Floats Left & Tilted) */}
                    <motion.div
                        animate={{ y: [-6, 6, -6], rotate: [-8, -6, -8] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-2 sm:left-12 top-4 sm:top-8 w-52 sm:w-72 h-32 sm:h-44 rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#1c1917] via-[#09090b] to-[#000000] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between z-10"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-400 uppercase font-semibold">Primary Vault</span>
                            <Wifi className="w-4 h-4 text-zinc-400 rotate-90" />
                        </div>
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-mono text-zinc-400">AVAILABLE LIQUIDITY</p>
                            <h3 className="text-base sm:text-xl font-bold font-mono tracking-tight text-white mt-0.5">$24,850.00</h3>
                        </div>
                        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/10">
                            <span>•••• 9286</span>
                            <span className="text-orange-300 font-bold">VISA</span>
                        </div>
                    </motion.div>

                    {/* Card 2: Radiant Terracotta Card (Floats Right & Tilted) */}
                    <motion.div
                        animate={{ y: [8, -8, 8], rotate: [10, 8, 10] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-2 sm:right-12 bottom-4 sm:bottom-6 w-52 sm:w-72 h-32 sm:h-44 rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#f97316] text-white border border-orange-300/30 shadow-[0_25px_60px_rgba(234,88,12,0.28)] flex flex-col justify-between z-20"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-100 uppercase font-semibold">Reserve Fund</span>
                            <Coins className="w-4 h-4 text-orange-200" />
                        </div>
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-mono text-orange-100/80">SAFE DAILY PACE</p>
                            <h3 className="text-base sm:text-xl font-bold font-mono tracking-tight text-white mt-0.5">$214.50<span className="text-xs font-normal opacity-80">/day</span></h3>
                        </div>
                        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono text-orange-100 pt-1 border-t border-white/20">
                            <span>ACTIVE PACING</span>
                            <span className="font-bold">OPTIMAL</span>
                        </div>
                    </motion.div>

                    {/* Center Floating Glass Orb Badge */}
                    <motion.div
                        animate={{ scale: [0.98, 1.03, 0.98], y: [-4, 4, -4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-30 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-stone-200 shadow-xl flex items-center gap-2.5"
                    >
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-mono uppercase text-zinc-400">Cycle Runway</p>
                            <p className="text-xs sm:text-sm font-bold font-mono text-zinc-900">+18.4% Safe</p>
                        </div>
                    </motion.div>

                </div>

                {/* SECTION 1: INTERACTIVE PRODUCT UI SIMULATION */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mt-10 sm:mt-16 rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-2xl p-4 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.05)] relative overflow-hidden"
                >
                    <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] sm:text-[11px] font-mono text-stone-400 ml-1.5 truncate max-w-[180px] sm:max-w-none">
                                auraledger.app • Live Telemetry Simulation
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>0ms Latency</span>
                        </div>
                    </div>

                    {/* Mini Dashboard Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Net Liquidity</p>
                            <h4 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 mt-1">$24,850.00</h4>
                            <p className="text-[10px] sm:text-[11px] font-mono text-emerald-600 mt-1.5 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +18.4% this month
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">Safe Daily Burn Rate</p>
                            <h4 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 mt-1">$214.50<span className="text-xs font-normal text-zinc-400">/day</span></h4>
                            <p className="text-[10px] sm:text-[11px] font-mono text-amber-600 mt-1.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Optimal runway pace
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400">Active Vault Reserves</p>
                            <h4 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 mt-1">3 Targets</h4>
                            <p className="text-[10px] sm:text-[11px] font-mono text-orange-600 mt-1.5 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> 68% milestone complete
                            </p>
                        </div>
                    </div>

                    <div className="mt-3.5 sm:mt-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/80">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-400 pb-2 border-b border-stone-100 mb-2">
                            <span>RECENT LEDGER STREAM</span>
                            <span>REAL-TIME AUDIT</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[9px]">ST</div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 truncate text-[11px] sm:text-xs">Stripe Settlement</p>
                                        <p className="text-[9px] font-mono text-zinc-400">Primary Inflow • #client</p>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-emerald-600 text-xs sm:text-sm shrink-0">+$2,450.00</span>
                            </div>
                            <div className="flex items-center justify-between py-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[9px]">VC</div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-zinc-900 truncate text-[11px] sm:text-xs">Vercel Edge Cloud</p>
                                        <p className="text-[9px] font-mono text-zinc-400">Infrastructure • #devops</p>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-zinc-900 text-xs sm:text-sm shrink-0">-$20.00</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 2: WHY AURALEDGER (PROBLEM VS SOLUTION) */}
                <div className="mt-16 sm:mt-28">
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
                        <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-orange-600 font-bold">The Strategic Advantage</h2>
                        <p className="text-2xl sm:text-4xl font-extrabold text-zinc-950 mt-1 tracking-tight">Why Switch From Spreadsheets?</p>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-2 px-2">
                            Traditional budgeting apps sell your financial habits or drown you in broken bank syncing. AuraLedger takes the high-performance local approach.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-rose-50/40 border border-rose-200/60">
                            <span className="text-[11px] font-mono text-rose-600 font-bold uppercase tracking-wider">Traditional Money Trackers</span>
                            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mt-1.5">Fragile, Leaky & Complex</h3>
                            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm text-zinc-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-500 font-bold">✕</span>
                                    <span><strong>Data Profiling:</strong> Free apps monetize by packaging and profiling your transaction habits.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-500 font-bold">✕</span>
                                    <span><strong>Bank Sync Glitches:</strong> Open banking connections break frequently and duplicate entries.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-rose-500 font-bold">✕</span>
                                    <span><strong>Clunky Sheets:</strong> Excel spreadsheets break mobile workflows and require tedious formula upkeep.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-emerald-50/40 border border-emerald-200/70 shadow-xs">
                            <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-wider">The AuraLedger Standard</span>
                            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mt-1.5">Sleek, Sovereign & Instant</h3>
                            <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm text-zinc-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>100% Client-Side Sovereignty:</strong> Encrypted in your browser cache. Zero server data profiling.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Predictive Daily Burn:</strong> Dynamically calculates safe daily spend velocity to prevent end-of-month deficits.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Multi-Tenant Client Switching:</strong> Switch seamlessly between separate personal, freelance, and business vaults.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: CALL TO ACTION CARD */}
                <div className="mt-16 sm:mt-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1b0e07] via-[#100703] to-[#050201] text-white p-6 sm:p-12 relative overflow-hidden shadow-xl shadow-orange-950/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-[10px] sm:text-xs font-mono text-orange-400 font-bold uppercase tracking-widest">Instant Provisioning</span>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1.5 leading-tight">
                            Ready to Upgrade Your Financial Workspace?
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-300 mt-2.5 leading-relaxed">
                            No credit card required. Initialize your local encrypted ledger in less than 30 seconds.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
                            <button
                                onClick={() => onOpenAuth("signup")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-110 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                <span>Get Started Now</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onOpenAuth("signin")}
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            {/* FOOTER */}
            <footer className="relative z-10 bg-white/90 border-t border-stone-200/80 pt-10 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-stone-100 text-xs">
                        <div className="col-span-2 sm:col-span-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs">
                                    A
                                </div>
                                <span className="font-bold text-zinc-950">AuraLedger</span>
                            </div>
                            <p className="text-stone-500 mt-2 text-[11px] leading-relaxed">
                                The high-velocity tactile personal finance operating system. Built for privacy, speed, and precision.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px] sm:text-[11px] mb-2.5">Modules</h4>
                            <ul className="space-y-1.5 text-stone-500 text-[11px]">
                                <li><button onClick={() => onOpenAuth("signin")} className="hover:text-zinc-900 cursor-pointer">Executive HUD</button></li>
                                <li><button onClick={() => onOpenAuth("signin")} className="hover:text-zinc-900 cursor-pointer">Omni Ledger</button></li>
                                <li><button onClick={() => onOpenAuth("signin")} className="hover:text-zinc-900 cursor-pointer">Cashflow Matrix</button></li>
                                <li><button onClick={() => onOpenAuth("signin")} className="hover:text-zinc-900 cursor-pointer">Target Vaults</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px] sm:text-[11px] mb-2.5">Privacy</h4>
                            <ul className="space-y-1.5 text-stone-500 text-[11px]">
                                <li className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Client Sandbox</li>
                                <li className="flex items-center gap-1"><Lock className="w-3 h-3 text-orange-600" /> Local Encrypted</li>
                                <li>Zero Data Profiling</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-mono font-bold text-zinc-950 uppercase tracking-wider text-[10px] sm:text-[11px] mb-2.5">Engine</h4>
                            <ul className="space-y-1.5 text-stone-500 font-mono text-[10px]">
                                <li>React 19 Core</li>
                                <li>Tailwind CSS v4</li>
                                <li>Framer Motion Physics</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] sm:text-[11px] font-mono text-stone-400">
                        <p>© 2026 AuraLedger FinOS. All rights reserved.</p>
                        <p className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Engine Status: 100% Operational
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}