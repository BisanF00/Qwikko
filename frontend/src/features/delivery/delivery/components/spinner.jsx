// components/SpinnerDots.jsx
import React from "react";

/**
 * SpinnerDots
 * props:
 *  - size: قطر السبنر بالبكسل (افتراضي 96)
 *  - dotSize: قطر النقطة بالبكسل (افتراضي 12)
 *  - count: عدد النقاط (افتراضي 8)
 *  - speed: مدة الدورة بالثواني (افتراضي 1.2)
 */
export default function SpinnerDots({
  size = 96,
  dotSize = 12,
  count = 8,
  speed = 1.2,
}) {
  const dots = Array.from({ length: count });
  return (
    <div
      className="inline-flex items-center justify-center"
      style={{
        "--s": `${size}px`,
        "--d": `${dotSize}px`,
        "--speed": `${speed}s`,
      }}
    >
      <div
        className="relative"
        style={{
          width: "var(--s)",
          height: "var(--s)",
          // خلفية خفيفة حسب الثيم لهيبة 👑
          background:
            "conic-gradient(from 180deg, color-mix(in oklab, var(--textbox) 70%, transparent), transparent 70%)",
          borderRadius: "999px",
          filter:
            "drop-shadow(0 4px 12px color-mix(in oklab, var(--textbox) 30%, transparent))",
        }}
        aria-label="Loading…"
        role="status"
      >
        {/* النقاط */}
        {dots.map((_, i) => (
          <span
            key={i}
            className="absolute inset-0"
            style={{
              // زاوية كل نقطة حول الدائرة
              transform: `rotate(${
                (360 / count) * i
              }deg) translate(calc(var(--s) / 2 - var(--d) - 2px))`,
            }}
          >
            <span
              className="block"
              style={{
                width: "var(--d)",
                height: "var(--d)",
                borderRadius: "999px",
                // تدرّج لطيف بين primary و button (يحترم الدارك/لايت)
                background:
                  "radial-gradient(circle at 30% 30%, var(--primary), var(--button))",
                boxShadow:
                  "0 0 0 2px color-mix(in oklab, var(--textbox) 45%, transparent)",
                // حركة النبض مع اختلاف التأخير لعمل تأثير "بتلحق بعض"
                animation: "spinnerDotPulse var(--speed) ease-in-out infinite",
                animationDelay: `calc(${i} * (var(--speed) / ${count}) * -1)`,
              }}
            />
          </span>
        ))}
      </div>

      {/* أنماط الحركة (محلية) */}
      <style>{`
        @keyframes spinnerDotPulse {
          0%   { transform: scale(0.6); opacity: .25; filter: brightness(0.95) }
          30%  { transform: scale(1);   opacity: 1;    filter: brightness(1.05) }
          60%  { transform: scale(0.8); opacity: .6;  }
          100% { transform: scale(0.6); opacity: .25; }
        }
      `}</style>
    </div>
  );
}
