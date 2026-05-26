"use client";

import { useState, useEffect } from "react";

interface CurtainIntroProps {
  onComplete: () => void;
  fullScreen?: boolean;
}

const TEXT = "Raj Lottery";
const LETTERS = TEXT.split("");

/**
 * Curtain opening animation with company name reveal
 */
export default function CurtainIntro({
  onComplete,
  fullScreen = true,
}: CurtainIntroProps): JSX.Element {
  const [curtainOpen, setCurtainOpen] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  const [visibleLetters, setVisibleLetters] = useState<number>(0);

  useEffect(() => {
    // Start curtain opening after 2 seconds
    const curtainTimer = setTimeout(() => {
      setCurtainOpen(true);
    }, 2000);

    // Show company name container right after curtain opens (6s + 200ms)
    const nameTimer = setTimeout(() => {
      setShowName(true);
    }, 3000);

    // Show letters one by one starting immediately after container appears
    const letterTimers: NodeJS.Timeout[] = [];
    LETTERS.forEach((_: string, index: number) => {
      const timer = setTimeout(() => {
        setVisibleLetters(index + 1);
      }, 3000 + index * 150); // 150ms delay between each letter
      letterTimers.push(timer);
    });

    // Complete intro after 10 seconds total
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => {
      clearTimeout(curtainTimer);
      clearTimeout(nameTimer);
      letterTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`${fullScreen ? "fixed" : "absolute"} inset-0 z-50`}>
      {/* Left Curtain */}
      <div
        className="absolute top-0 bottom-0 w-1/2 transition-all duration-[4000ms] ease-in-out"
        style={{
          background:
            "linear-gradient(90deg, #8b0000 0%, #a52a2a 20%, #dc143c 40%, #ff0000 60%, #dc143c 80%, #a52a2a 100%)",
          left: curtainOpen ? "-50%" : "0",
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.5)",
          animation: curtainOpen
            ? "none"
            : "curtainWave 3s ease-in-out infinite",
        }}
      >
        {/* Curtain folds */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-[5%]"
              style={{
                left: `${i * 5}%`,
                background:
                  i % 2 === 0
                    ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Curtain */}
      <div
        className="absolute top-0 bottom-0 w-1/2 transition-all duration-[4000ms] ease-in-out"
        style={{
          background:
            "linear-gradient(270deg, #8b0000 0%, #a52a2a 20%, #dc143c 40%, #ff0000 60%, #dc143c 80%, #a52a2a 100%)",
          right: curtainOpen ? "-50%" : "0",
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.5)",
          animation: curtainOpen
            ? "none"
            : "curtainWave 3s ease-in-out infinite 0.5s",
        }}
      >
        {/* Curtain folds */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-[5%]"
              style={{
                left: `${i * 5}%`,
                background:
                  i % 2 === 0
                    ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Company Name */}
      <div
        className={`absolute inset-y-10 inset-x-0 pt-32 transition-all duration-1000 ${
          showName ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <h1
            className="text-4xl sm:text-7xl font-bold flex justify-center items-center !leading-none"
            style={{
              fontFamily: "Georgia, serif",
              lineHeight: "normal !important",
            }}
          >
            {LETTERS.map((letter: string, index: number) => (
              <div key={index} className="">
                <span
                  className={`inline-block transition-all duration-500 ${
                    index < visibleLetters
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-10"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #f0c75e 75%, #d4af37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))",
                    marginRight: letter === " " ? "0.5em" : "0",
                    transform: "translateZ(0)",
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              </div>
            ))}
          </h1>
          <div
            className="h-1 mx-auto mt-6 rounded-full animate-pulse"
            style={{
              width: "300px",
              background:
                "linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%)",
              boxShadow: "0 0 20px rgba(255,215,0,0.8)",
            }}
          />
        </div>
      </div>

      {/* Curtain rod */}
    </div>
  );
}
