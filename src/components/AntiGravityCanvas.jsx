import React, { useEffect, useRef } from "react";

export default function AntiGravityCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: -9999,
      y: -9999,
      radius: 110 // Spotlight reveal radius
    };

    class RevealDot {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Default state: Mukammal invisible (alpha = 0, size = 0)
        this.alpha = 0;
        this.size = 0;
        this.maxAlpha = 0.45;
        this.maxSize = 2;
      }

      draw() {
        if (this.alpha <= 0.01) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 235, ${this.alpha})`;
        ctx.shadowColor = "rgba(254, 215, 170, 0.4)";
        ctx.shadowBlur = 3;
        ctx.fill();
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Jab cursor paas aaye -> Appear (fade in + scale up)
        if (dist < mouse.radius) {
          const intensity = 1 - dist / mouse.radius; // Center par max 1, edge par 0
          const targetAlpha = this.maxAlpha * intensity;
          const targetSize = this.maxSize * intensity;

          this.alpha += (targetAlpha - this.alpha) * 0.22;
          this.size += (targetSize - this.size) * 0.22;
        } else {
          // Cursor nikalte hi -> Disappear wapas zero par
          if (this.alpha > 0.005) {
            this.alpha += (0 - this.alpha) * 0.06;
            this.size += (0 - this.size) * 0.06;
          } else {
            this.alpha = 0;
            this.size = 0;
          }
        }

        this.draw();
      }
    }

    let dots = [];

    const initGrid = () => {
      dots = [];
      const gap = 20; // High-density clean matrix
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push(new RevealDot(c * gap, r * gap));
        }
      }
    };

    initGrid();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < dots.length; i++) {
        dots[i].update();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initGrid();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("resize", handleResize);
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}