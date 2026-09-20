import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass,
    ReceiptText,
    LineChart,
    Vault,
    Plus,
    ChevronDown,
    Check,
    LogOut,
    Mail,
    Phone,
    ShieldCheck,
    KeyRound
} from "lucide-react";
import { CURRENCIES } from "../types/models";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "ledger", label: "Ledger", icon: ReceiptText },
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "vaults", label: "Vaults", icon: Vault }
];

export default function Navbar({
    activeTab,
    setActiveTab,
    currentCurrency,
    setCurrentCurrency,
    currentUser,
    onSignOut,
    onOpenNewTransaction,
    onOpenChangePassword
}) {
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const currencyRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (currencyRef.current && !currencyRef.current.contains(e.target)) {
                setIsCurrencyOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        window.addEventListener("mousedown", handleOutsideClick);
        return () => window.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const activeCurrencyData = CURRENCIES[currentCurrency] || CURRENCIES.USD;

    const userInitials = currentUser?.name
        ? currentUser.name.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase()
        : "AL";

    return (
        <>
            <header className="sticky top-0 z-50 w-full pt-4 px-3 sm:px-8 max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between gap-3 py-2.5 px-4 sm:px-6 rounded-2xl bg-white/80 backdrop-blur-2xl border border-stone-200/70 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all">

                    {/* Brand Monogram */}
                    <div className="flex items-center gap-3 shrink-0 select-none">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#2a1308] to-[#120703] p-[1px] shadow-sm shadow-orange-950/20">
                            <div className="w-full h-full rounded-[11px] bg-[#170b05] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 via-transparent to-amber-400/20" />
                                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-orange-500 relative z-10" fill="none">
                                    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                    <path d="M12 3V12M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-sm font-bold tracking-tight text-zinc-950 leading-none">AuraLedger</h1>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            </div>
                            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">Tactile FinOS</p>
                        </div>
                    </div>

                    {/* Desktop & Tablet Central Navigation Pills */}
                    <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-stone-100/90 border border-stone-200/60 shadow-inner">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${isActive ? "text-white font-semibold" : "text-zinc-600 hover:text-zinc-950"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav-pill"
                                            className="absolute inset-0 rounded-full bg-zinc-950 shadow-sm"
                                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{item.label}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right Action Rail */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        {/* Custom Currency Selector */}
                        <div className="relative" ref={currencyRef}>
                            <button
                                type="button"
                                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${isCurrencyOpen
                                    ? "bg-stone-100 border-zinc-300 text-zinc-950 shadow-xs"
                                    : "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-zinc-700"
                                    }`}
                            >
                                <span className="font-bold text-orange-600">{activeCurrencyData.symbol}</span>
                                <span>{activeCurrencyData.code}</span>
                                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isCurrencyOpen ? "rotate-180 text-zinc-800" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isCurrencyOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-11 z-[60] w-36 rounded-2xl border border-stone-200/90 bg-white shadow-xl p-1.5 overflow-hidden"
                                    >
                                        <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                            Currency
                                        </div>
                                        {Object.keys(CURRENCIES).map((code) => {
                                            const curr = CURRENCIES[code];
                                            const isSelected = currentCurrency === code;

                                            return (
                                                <button
                                                    key={code}
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrentCurrency(code);
                                                        setIsCurrencyOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${isSelected
                                                        ? "bg-orange-500/10 text-orange-700 font-semibold"
                                                        : "text-zinc-600 hover:bg-stone-100 hover:text-zinc-950"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 text-center font-bold text-zinc-900">{curr.symbol}</span>
                                                        <span>{curr.code}</span>
                                                    </div>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Primary Action Button */}
                        <button
                            onClick={onOpenNewTransaction}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b93815] via-[#ea580c] to-[#f97316] hover:brightness-105 text-white text-xs font-medium shadow-sm shadow-orange-600/25 active:scale-95 transition-all cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span className="hidden sm:inline font-semibold">Add Entry</span>
                        </button>

                        {/* Profile Avatar Popover */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-900 to-black hover:brightness-125 text-orange-200 flex items-center justify-center text-[11px] font-mono font-bold border border-zinc-700/60 shadow-sm transition-all cursor-pointer select-none active:scale-95"
                            >
                                {userInitials}
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute right-0 top-12 z-[70] w-64 rounded-3xl border border-stone-200/90 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)] p-2.5 overflow-hidden"
                                    >
                                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-orange-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-800 shadow-inner">
                                                {userInitials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs font-bold text-zinc-950 truncate">{currentUser?.name}</h4>
                                                <p className="text-[11px] font-mono text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{currentUser?.email}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="py-2.5 px-1 space-y-1.5">
                                            <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded-lg hover:bg-stone-50 text-zinc-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3 text-zinc-400" /> Phone
                                                </span>
                                                <span className="text-zinc-800 font-semibold">{currentUser?.phone}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded-lg hover:bg-stone-50 text-zinc-500">
                                                <span className="flex items-center gap-1.5">
                                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Vault Storage
                                                </span>
                                                <span className="text-emerald-700 font-semibold">Local Partitioned</span>
                                            </div>
                                        </div>

                                        {/* Actions Group */}
                                        <div className="pt-1.5 border-t border-stone-100 space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    if (onOpenChangePassword) onOpenChangePassword();
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-semibold text-zinc-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                                                    <span>Change Password</span>
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    onSignOut();
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
                                            >
                                                <span>Sign Out / Switch</span>
                                                <LogOut className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>

                </div>
            </header>

            {/* Dynamic Expanding Porcelain Glass Dock (xl:hidden) */}
            <div className="xl:hidden fixed bottom-6 inset-x-0 z-50 px-4 pointer-events-none flex justify-center">
                <motion.nav
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-white/85 backdrop-blur-2xl border border-stone-200/90 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.03]"
                >
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                layout
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.04 }}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative py-2.5 px-3.5 rounded-full flex items-center gap-2 cursor-pointer select-none transition-colors ${isActive ? "text-orange-950 font-semibold" : "text-stone-400 hover:text-stone-700"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="dynamic-island-pill"
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/15 border border-orange-500/25 shadow-xs"
                                        transition={{ type: "spring", stiffness: 480, damping: 35 }}
                                    />
                                )}

                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.12 : 1,
                                        y: isActive ? -0.5 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                                    className="relative z-10 flex items-center justify-center"
                                >
                                    <Icon
                                        className={`w-4 h-4 transition-colors duration-200 ${isActive ? "text-orange-600 stroke-[2.4]" : "text-stone-400 stroke-[1.8]"
                                            }`}
                                    />
                                </motion.div>

                                <AnimatePresence mode="popLayout" initial={false}>
                                    {isActive && (
                                        <motion.span
                                            key={item.id}
                                            initial={{ opacity: 0, width: 0, x: -6 }}
                                            animate={{ opacity: 1, width: "auto", x: 0 }}
                                            exit={{ opacity: 0, width: 0, x: -4 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 420,
                                                damping: 30,
                                                opacity: { duration: 0.18 }
                                            }}
                                            className="text-xs font-sans font-bold tracking-tight text-orange-950 relative z-10 whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </motion.nav>
            </div>
        </>
    );
}