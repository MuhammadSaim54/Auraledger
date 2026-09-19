import React, { useState, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity 
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const TIMEFRAMES = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "90d", label: "90D", days: 90 }
];

export default function CashflowMatrix({ 
  transactions = [], 
  startingBalance = 200000, 
  currentCurrency = "USD" 
}) {
  const containerRef = useRef(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [activeData, setActiveData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const activeDays = useMemo(() => {
    return TIMEFRAMES.find(t => t.id === selectedTimeframe)?.days || 30;
  }, [selectedTimeframe]);

  const points = useMemo(() => {
    const today = new Date();
    const result = [];
    const base = Number(startingBalance) || 200000;

    for (let i = activeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const progress = (activeDays - 1 - i) / (activeDays - 1 || 1);
      const wave = Math.sin(progress * Math.PI * 2) * (base * 0.035) + 
                   Math.cos(progress * Math.PI * 4) * (base * 0.015);
      
      const naturalGrowth = progress * 0.075 * base;
      const computedBalance = Math.round(base * 0.94 + naturalGrowth + wave);

      result.push({
        index: activeDays - 1 - i,
        date: key,
        label: dayLabel,
        balance: computedBalance
      });
    }

    return result;
  }, [startingBalance, activeDays]);

  const width = 900;
  const height = 300;
  const padX = 18;
  const padTop = 36;
  const padBottom = 38;

  const minVal = Math.min(...points.map((p) => p.balance)) * 0.99;
  const maxVal = Math.max(...points.map((p) => p.balance)) * 1.01 || 1;

  const getX = (idx) => padX + (idx / (points.length - 1)) * (width - padX * 2);
  const getY = (val) =>
    height - padBottom - ((val - minVal) / (maxVal - minVal || 1)) * (height - padTop - padBottom);

  const { pathD, areaD, coords } = useMemo(() => {
    if (points.length === 0) return { pathD: "", areaD: "", coords: [] };

    const c = points.map((p, i) => ({
      x: getX(i),
      y: getY(p.balance),
      data: p
    }));

    let d = `M ${c[0].x} ${c[0].y}`;

    for (let i = 0; i < c.length - 1; i++) {
      const p0 = c[i];
      const p1 = c[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const baselineY = height - padBottom;
    const aD = `${d} L ${c[c.length - 1].x} ${baselineY} L ${c[0].x} ${baselineY} Z`;

    return { pathD: d, areaD: aD, coords: c };
  }, [points, minVal, maxVal]);

  const latestPoint = points[points.length - 1] || { balance: startingBalance, label: "Today" };
  const currentDisplayPoint = activeData || latestPoint;
  const delta = (latestPoint.balance || 0) - (points[0]?.balance || 0);
  const isPositive = delta >= 0;

  const pointerX = useMotionValue(getX(points.length - 1));
  const pointerY = useMotionValue(getY(latestPoint.balance));

  const springX = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.1 });
  const springY = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.1 });

  // Tooltip Clamped Percentage (so it never clips out of screen on mobile)
  const tooltipLeftPercent = useTransform(springX, (val) => {
    const raw = (val - padX) / (width - padX * 2);
    const clamped = Math.max(0.12, Math.min(0.88, raw));
    return `${clamped * 100}%`;
  });

  const handlePointer = (e) => {
    if (!containerRef.current || coords.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const boundedX = Math.max(0, Math.min(rect.width, rawX));
    const ratio = boundedX / rect.width;

    const closestIdx = Math.round(ratio * (coords.length - 1));
    const targetCoord = coords[closestIdx];

    if (targetCoord) {
      pointerX.set(targetCoord.x);
      pointerY.set(targetCoord.y);
      setActiveData(targetCoord.data);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-4 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[32px] bg-white border border-stone-200/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.03)] overflow-hidden select-none"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 border border-orange-500/20">
              <Activity className="w-3 h-3 text-orange-600 animate-pulse" />
              <span>Liquidity Matrix</span>
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              {isHovered ? "Touch Scrubbing" : "Trajectory"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 sm:gap-3 mt-1.5 sm:mt-2.5">
            <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-zinc-950">
              {formatCurrency(currentDisplayPoint?.balance || 0, currentCurrency)}
            </h3>

            <div className={`flex items-center gap-0.5 px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-bold shrink-0 ${
              isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span>{isPositive ? "+" : ""}{formatCurrency(delta, currentCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex p-0.5 rounded-xl bg-stone-100/80 border border-stone-200/60 shadow-inner">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => {
                  setSelectedTimeframe(tf.id);
                  setActiveData(null);
                }}
                className={`relative px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-semibold transition-colors cursor-pointer select-none ${
                  selectedTimeframe === tf.id ? "text-zinc-950 font-bold" : "text-stone-500"
                }`}
              >
                {selectedTimeframe === tf.id && (
                  <motion.div
                    layoutId="active-tf-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow-xs border border-stone-200/50"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tf.label}</span>
              </button>
            ))}
          </div>

          <div className="flex sm:hidden md:flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-lg bg-stone-50 border border-stone-200/60 text-right">
              <span className="text-[8px] sm:text-[9px] font-mono text-stone-400 block uppercase">Peak</span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-700">
                {formatCurrency(maxVal, currentCurrency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Container with touch-none for flawless mobile gesture handling */}
      <div 
        ref={containerRef}
        onPointerDown={(e) => {
          setIsHovered(true);
          handlePointer(e);
        }}
        onPointerMove={handlePointer}
        onPointerUp={() => setIsHovered(false)}
        onPointerCancel={() => setIsHovered(false)}
        onPointerLeave={() => {
          setIsHovered(false);
          setActiveData(null);
          pointerX.set(getX(points.length - 1));
          pointerY.set(getY(latestPoint.balance));
        }}
        className="relative mt-3 sm:mt-5 cursor-crosshair touch-none select-none"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-64 md:h-72 overflow-visible"
        >
          <defs>
            <linearGradient id="terracottaMatrixGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ea580c" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Reference Lines */}
          <line x1={padX} y1={padTop} x2={width - padX} y2={padTop} stroke="#f0eeeb" strokeWidth="1" />
          <line x1={padX} y1={(height - padBottom + padTop) / 2} x2={width - padX} y2={(height - padBottom + padTop) / 2} stroke="#f0eeeb" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={padX} y1={height - padBottom} x2={width - padX} y2={height - padBottom} stroke="#e5e2dc" strokeWidth="1.2" />

          {/* Paths */}
          <path d={areaD} fill="url(#terracottaMatrixGlow)" />
          <path
            d={pathD}
            fill="none"
            stroke="#c2410c"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#softGlow)"
          />

          {/* Spring Guides */}
          <motion.line
            x1={springX}
            y1={padTop}
            x2={springX}
            y2={height - padBottom}
            stroke="#c2410c"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity={isHovered ? 0.9 : 0.4}
          />

          <motion.circle
            cx={springX}
            cy={springY}
            r="9"
            fill="#ea580c"
            fillOpacity="0.2"
          />
          <motion.circle
            cx={springX}
            cy={springY}
            r="4"
            fill="#ea580c"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>

        {/* Floating Tooltip Pill */}
        <motion.div
          className="absolute top-0 pointer-events-none z-20"
          style={{ 
            left: tooltipLeftPercent,
            transform: "translateX(-50%)"
          }}
        >
          <div className="px-2.5 sm:px-3.5 py-1 rounded-lg sm:rounded-xl bg-zinc-950 text-white border border-stone-800 shadow-xl flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <span className="text-[9px] sm:text-[10px] font-mono text-stone-400">{currentDisplayPoint.label}</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-orange-400">
              {formatCurrency(currentDisplayPoint.balance, currentCurrency)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Axis Hints */}
      <div className="flex items-center justify-between mt-2 sm:mt-3 text-[9px] sm:text-[10px] font-mono text-stone-400 px-0.5">
        <span>{points[0]?.label}</span>
        <span className="uppercase tracking-widest text-[8px] sm:text-[9px]">
          Drag to scrub
        </span>
        <span className="text-zinc-800 font-bold">Today</span>
      </div>
    </motion.section>
  );
}