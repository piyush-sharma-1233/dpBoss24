/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";

interface SlotReelProps {
  targetNumber: number;
  duration: number;
  delay: number;
  isSpinning: boolean;
  isRolling: boolean;
}

function SlotReel({
  targetNumber,
  duration,
  delay,
  isSpinning,
  isRolling,
}: SlotReelProps): JSX.Element {
  const reelRef = useRef<HTMLDivElement>(null);

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-"];
  const extendedNumbers = [...numbers, ...numbers, ...numbers];

  const getTranslateY = (num: number) => {
    if (num === -1) {
      return `translateY(-${(11 + 10) * 112}px)`; // Position for hyphen
    }
    return `translateY(-${(11 + num) * 112}px)`;
  };

  return (
    <div
      className="relative w-20 h-28 overflow-hidden rounded-lg"
      style={{
        background:
          "linear-gradient(135deg, #f8f8f8 0%, #ffffff 50%, #f8f8f8 100%)",
        boxShadow: `
          inset 0 4px 8px rgba(0,0,0,0.3),
          inset 0 -4px 8px rgba(0,0,0,0.2),
          inset 4px 0 8px rgba(0,0,0,0.15),
          inset -4px 0 8px rgba(0,0,0,0.15)
        `,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none z-10" />
      <div
        ref={reelRef}
        className={`flex flex-col items-center justify-start reel ${
          isRolling ? "is-rolling" : ""
        } ${isSpinning ? "is-spinning" : ""}`}
        style={
          {
            transform: getTranslateY(targetNumber),
            "--spin-duration": `${duration}ms`,
            "--reel-spin-duration": `${1 + delay * 0.1}s`,
          } as React.CSSProperties
        }
      >
        {extendedNumbers.map((num: number | string, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-center w-full h-28 text-6xl font-bold text-red-600"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
              fontFamily: "Arial Black, sans-serif",
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,248,248,0.95) 0%, rgba(248,248,248,0.7) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(to top, rgba(248,248,248,0.95) 0%, rgba(248,248,248,0.7) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

interface SlotMachineCounterProps {
  value: number;
  duration?: number;
  reelCount?: number;
}

export default function SlotMachineCounter({
  value,
  duration = 1200,
  reelCount = 2,
}: SlotMachineCounterProps): JSX.Element {
  const [displayedDigits, setDisplayedDigits] = useState<number[]>(
    Array(reelCount).fill(-1)
  );
  const [spinningReels, setSpinningReels] = useState<boolean[]>(
    Array(reelCount).fill(false)
  );
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [handlePulled, setHandlePulled] = useState<boolean>(false);
  const [handleAnimating, setHandleAnimating] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (value < 0) {
      setIsRolling(true);
      setDisplayedDigits(Array(reelCount).fill(-1));
      return;
    }

    setIsRolling(false);

    const targetDigits = value
      .toString()
      .padStart(reelCount, "0")
      .split("")
      .map(Number);
    const timers: NodeJS.Timeout[] = [];

    const animateReels = async () => {
      for (let i = 0; i < reelCount; i++) {
        // Start spinning the current reel
        setSpinningReels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            // Stop spinning and set the digit
            setDisplayedDigits((prev) => {
              const next = [...prev];
              next[i] = targetDigits[i];
              return next;
            });
            setSpinningReels((prev) => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
            resolve(null);
          }, 15000); // 15 seconds
          timers.push(timer);
        });
      }
    };

    animateReels();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [value, reelCount, duration]);

  const digits = displayedDigits;

  return (
    <div className="relative inline-block" style={{ perspective: "1500px" }}>
      <style>
        {`
          @keyframes reel-spin {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(-${11 * 112}px);
            }
          }
          .reel.is-rolling {
            animation: reel-spin var(--reel-spin-duration) linear infinite;
          }
          .reel.is-spinning {
            transition: transform var(--spin-duration) cubic-bezier(0.25, 0.1, 0.25, 1);
          }
        `}
      </style>
      <div
        className="relative px-8 py-6 rounded-[2rem]"
        style={{
          background:
            "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 20%, #ffffff 40%, #f5f5f5 60%, #e8e8e8 80%, #d8d8d8 100%)",
          border: "6px solid transparent",
          backgroundClip: "padding-box",
          boxShadow: `
            inset 0 8px 16px rgba(0,0,0,0.25),
            inset 0 -8px 16px rgba(0,0,0,0.15),
            inset 8px 0 16px rgba(0,0,0,0.1),
            inset -8px 0 16px rgba(0,0,0,0.1),
            0 25px 50px rgba(0,0,0,0.5),
            0 15px 30px rgba(0,0,0,0.3),
            0 0 0 6px #d4af37
          `,
          transform: "rotateY(-8deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute -inset-[6px] rounded-[3rem] -z-10"
          style={{
            background:
              "linear-gradient(135deg, #8b6914 0%, #b8860b 10%, #d4af37 20%, #f0c75e 30%, #ffd700 40%, #ffed4e 50%, #ffd700 60%, #f0c75e 70%, #d4af37 80%, #b8860b 90%, #8b6914 100%)",
            transform: "translateZ(-1px)",
          }}
        />
        <div className="flex gap-3 relative z-10">
          {digits.map((digit: number, index: number) => (
            <SlotReel
              key={index}
              targetNumber={digit}
              duration={1000} // Shorter duration for the final settle animation
              delay={0}
              isSpinning={spinningReels[index]}
              isRolling={isRolling || spinningReels[index]}
            />
          ))}
        </div>

        {/* Trigger Handle on Right Side - Golden Key Lever */}
        <div
          className={`absolute -right-[64px] top-[50px] -translate-y-1/2 select-none ${
            handleAnimating ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onMouseDown={() => {
            if (!handleAnimating) {
              setHandleAnimating(true);
              setHandlePulled(true);

              // Handle moves down first
              setTimeout(() => {
                // Handle returns to original position
                setHandlePulled(false);

                // Start spinning after handle animation completes
                setTimeout(() => {
                  // This manual trigger logic might need to be re-evaluated for sequential spin
                }, 200);
              }, 600);
            }
          }}
          style={{
            transform: handlePulled ? "translateY(70px)" : "translateY(-50px)",
            transition: "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Bulbous Top - Large rounded head */}
          <div
            className="relative w-7 h-7 mx-auto"
            style={{
              background:
                "radial-gradient(ellipse at 40% 35%, #ffed4e, #ffd700 35%, #f4d03f 60%, #d4af37 80%, #b8860b)",
              borderRadius: "50% 50% 45% 45%",
              boxShadow: `
                0 6px 12px rgba(0,0,0,0.4),
                inset -3px -3px 8px rgba(0,0,0,0.3),
                inset 3px 3px 8px rgba(255,255,255,0.6),
                0 0 25px rgba(255,215,0,0.4)
              `,
            }}
          ></div>

          {/* Thick Shaft - Main body */}
          <div
            className="relative w-2 h-10 mx-auto"
            style={{
              background:
                "linear-gradient(to right, #a67c1a 0%, #b8860b 10%, #d4af37 25%, #ffd700 45%, #ffed4e 50%, #ffd700 55%, #d4af37 75%, #b8860b 90%, #a67c1a 100%)",
              boxShadow: `
                inset 0 4px 8px rgba(255,255,255,0.5),
                inset 0 -4px 8px rgba(0,0,0,0.4),
                4px 0 8px rgba(0,0,0,0.3),
                -3px 0 6px rgba(0,0,0,0.2),
                0 0 20px rgba(255,215,0,0.3)
              `,
            }}
          >
            {/* Left shine */}
            <div
              className="absolute left-1 top-6 bottom-6 w-1 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 15%, rgba(255,255,255,0.6) 85%, transparent 100%)",
              }}
            />
            {/* Right shadow */}
            <div
              className="absolute right-1 top-6 bottom-6 w-1 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.2) 85%, transparent 100%)",
              }}
            />
          </div>

          {/* Bottom End - Wider base with teeth */}
          <div
            className="relative w-6 h-12 rounded-tr-[4px] rounded-br-[4px]"
            style={{
              background:
                "linear-gradient(135deg, #b8860b, #d4af37, #ffd700, #d4af37, #b8860b)",
              boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
            }}
          >
            {/* Key teeth pattern */}
          </div>
        </div>
      </div>

      <div
        className="absolute -inset-8 rounded-[3rem] -z-20"
        style={{
          background:
            "linear-gradient(135deg, #6b5310 0%, #8b6914 8%, #a67c1a 16%, #b8860b 24%, #d4af37 32%, #e8c55a 40%, #ffd700 48%, #ffed4e 50%, #ffd700 52%, #e8c55a 60%, #d4af37 68%, #b8860b 76%, #a67c1a 84%, #8b6914 92%, #6b5310 100%)",
          boxShadow: `
            0 30px 60px rgba(0,0,0,0.6),
            0 20px 40px rgba(0,0,0,0.5),
            inset 0 4px 8px rgba(255,255,255,0.5),
            inset 0 -4px 8px rgba(0,0,0,0.5),
            0 0 30px rgba(255,215,0,0.3)
          `,
          transform: "translateZ(-15px)",
        }}
      />
    </div>
  );
}
