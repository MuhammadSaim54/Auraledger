import React from "react";
import { motion } from "framer-motion";

export default function BotanicalCradle({ 
  children, 
  variant = "emerald", 
  floatDelay = 0 
}) {
  const isAmber = variant === "amber";

  return (
    <div className="relative isolate px-1 sm:px-2 py-2 sm:py-4 select-none sm:[perspective:1400px]">
      
      {/* 1. Deep Ambient Bio-Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        className={`absolute -inset-2 sm:-inset-4 rounded-[40px] sm:rounded-[48px] blur-2xl sm:blur-3xl pointer-events-none -z-30 ${
          isAmber
            ? "bg-gradient-to-tr from-amber-400/20 via-orange-500/15 to-transparent"
            : "bg-gradient-to-tr from-emerald-400/20 via-teal-500/15 to-transparent"
        }`}
      />

      {/* 2. Top Sculptural Leaf (Mobile par optimized, no text interference) */}
      <motion.div
        animate={{
          y: [-3, 4, -3],
          rotate: isAmber ? [22, 26, 22] : [-22, -26, -22]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        className={`absolute -top-6 sm:-top-8 w-20 sm:w-28 h-28 sm:h-36 pointer-events-none -z-10 transition-transform duration-500 ${
          isAmber ? "-right-2 sm:-right-3" : "-left-2 sm:-left-3"
        }`}
      >
        <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)]">
          <defs>
            <linearGradient id={`topLeaf-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isAmber ? "#fef3c7" : "#d1fae5"} stopOpacity="0.85" />
              <stop offset="45%" stopColor={isAmber ? "#f59e0b" : "#10b981"} stopOpacity="0.7" />
              <stop offset="100%" stopColor={isAmber ? "#b45309" : "#047857"} stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id={`veinGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path
            d="M50 5 C75 25, 95 65, 80 115 C55 125, 20 100, 15 65 C12 35, 30 15, 50 5 Z"
            fill={`url(#topLeaf-${variant})`}
          />
          <path d="M50 8 C52 45, 54 85, 50 118" stroke={`url(#veinGrad-${variant})`} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M50 40 Q68 45, 78 55" stroke={`url(#veinGrad-${variant})`} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <path d="M50 65 Q30 70, 24 82" stroke={`url(#veinGrad-${variant})`} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </svg>
      </motion.div>

      {/* 3. Bottom Base Leaf */}
      <motion.div
        animate={{
          y: [3, -4, 3],
          rotate: isAmber ? [-15, -18, -15] : [15, 18, 15]
        }}
        transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 0.4 }}
        className={`absolute -bottom-6 sm:-bottom-8 w-24 sm:w-32 h-32 sm:h-40 pointer-events-none -z-10 transition-transform duration-500 ${
          isAmber ? "-left-3 sm:-left-5" : "-right-3 sm:-right-5"
        }`}
      >
        <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.08)]">
          <defs>
            <linearGradient id={`bottomLeaf-${variant}`} x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={isAmber ? "#d97706" : "#059669"} stopOpacity="0.75" />
              <stop offset="50%" stopColor={isAmber ? "#fbbf24" : "#34d399"} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isAmber ? "#fffbeb" : "#ecfdf5"} stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path
            d="M60 140 C20 125, 10 75, 25 30 C45 10, 85 15, 95 50 C105 85, 90 125, 60 140 Z"
            fill={`url(#bottomLeaf-${variant})`}
          />
          <path d="M60 138 C58 95, 55 55, 58 20" stroke={`url(#veinGrad-${variant})`} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M58 50 Q40 55, 30 65" stroke={`url(#veinGrad-${variant})`} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </svg>
      </motion.div>

      {/* 4. Main Floating Card Body (Sharp Antialiased on Mobile & Desktop) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        whileHover={{ 
          y: -10, 
          scale: 1.01,
          transition: { type: "spring", stiffness: 350, damping: 20 }
        }}
        style={{
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden"
        }}
        className="relative z-10 rounded-[28px] sm:rounded-[36px] bg-white sm:bg-white/95 sm:backdrop-blur-xl border border-stone-200/90 sm:border-white/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] cursor-pointer overflow-hidden"
      >
        {children}
      </motion.div>

    </div>
  );
}