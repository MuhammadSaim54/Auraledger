import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ParallaxMonolithCard({
  children,
  className = "",
  floatDelay = 0,
  accentGlow = "rgba(234, 88, 12, 0.12)"
}) {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 24, mass: 0.8 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e) => {
    // Only apply mouse parallax on desktop / mouse devices
    if (window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    x.set(offsetX / width - 0.5);
    y.set(offsetY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay
      }}
      className="relative sm:[perspective:1200px]"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden"
        }}
        whileHover={{ scale: 1.008 }}
        transition={{ duration: 0.3 }}
        className={`relative rounded-[28px] sm:rounded-[36px] bg-white sm:bg-white/95 border border-stone-200/90 sm:border-white/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] ${className}`}
      >
        <div className="relative z-10 rounded-[27px] sm:rounded-[35px] bg-white sm:bg-[#fdfcfb]/95 overflow-hidden">
          <div className="relative z-20">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}