"use client";

import React, { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  pulseSpeed: number;
}

const SPARK_COLORS = [
  "#FFD700", // Bright Gold
  "#F59E0B", // Warm Amber
  "#F97316", // Festive Orange
  "#FBBF24", // Golden Yellow
  "#FFF275", // Sparkling Bright
];

export default function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initial spark population
    const sparkCount = Math.min(65, Math.floor((width * height) / 18000));
    const sparks: Spark[] = [];

    const createSpark = (initialY?: number): Spark => ({
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.7 + 0.25),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.3,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      pulseSpeed: Math.random() * 0.03 + 0.01,
    });

    for (let i = 0; i < sparkCount; i++) {
      sparks.push(createSpark());
    }

    // Burst listener
    const handleBurst = (e: Event) => {
      const custom = e as CustomEvent<{ count?: number }>;
      const burstSize = custom.detail?.count || 45;
      for (let i = 0; i < burstSize; i++) {
        sparks.push({
          x: width / 2 + (Math.random() - 0.5) * 200,
          y: height * 0.6 + (Math.random() - 0.5) * 100,
          size: Math.random() * 3.5 + 1.2,
          speedY: -(Math.random() * 3.5 + 1.5),
          speedX: (Math.random() - 0.5) * 4,
          opacity: 1,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          pulseSpeed: 0.05,
        });
      }
    };

    window.addEventListener("spark-burst", handleBurst);

    // Animation Loop
    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.02;

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(angle + i) * 0.2;
        s.opacity += Math.sin(angle * 2 + i) * 0.015;

        // Reset if moved off screen
        if (s.y < -20 || s.opacity <= 0.05) {
          if (sparks.length > sparkCount) {
            sparks.splice(i, 1);
            i--;
            continue;
          } else {
            sparks[i] = createSpark(height + 10);
            continue;
          }
        }

        // Render ember with gentle radial glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.opacity));
        ctx.shadowBlur = s.size * 5;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("spark-burst", handleBurst);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
