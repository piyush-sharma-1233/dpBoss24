'use client';

import { useMemo } from 'react';

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
    const icons = ['🎰', '🎲', '🃏', '🎴', '⭐', '✨', '💎', '🎪', '🎯', '🍀', '💰', '🎁', '🔔', '🌟', '💵', '🏆'];
    return Array.from({ length: 300 }, (_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      size: 15 + Math.random() * 45,
      duration: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 2,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
