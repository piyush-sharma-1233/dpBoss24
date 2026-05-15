"use client";

import { useMemo } from "react";

interface FloatingElement {
  id: number;
  icon: string;
  size: number;
  duration: number;
  delay: number;
  startX: number;
  startY: number;
  opacity: number;
  rotation: number;
}

/**
 * Animated background with floating casino-themed elements
 */
export default function AnimatedBackground(): JSX.Element {
  const elements = useMemo<FloatingElement[]>(() => {
    const icons = [
      "🎰",
      "🎲",
      "🃏",
      "🎴",
      "⭐",
      "✨",
      "💎",
      "🎪",
      "🎯",
      "🍀",
      "💰",
      "🎁",
      "🔔",
      "🌟",
      "💵",
      "🏆",
    ];
    return Array.from({ length: 300 }, (_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      size: 15 + Math.random() * 45,
      duration: 3 + Math.random() * 5, // 50% slower (increased from 1.5-4s to 3-8s)
      delay: Math.random() * 2,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          will-change: transform, opacity;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
      `}</style>
      {elements.map((element: FloatingElement) => (
        <div
          key={element.id}
          className="absolute animate-float"
          style={{
            left: `${element.startX}%`,
            top: `${element.startY}%`,
            fontSize: `${element.size}px`,
            animation: `float ${element.duration}s linear ${element.delay}s infinite`,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.icon}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
    </div>
  );
}
