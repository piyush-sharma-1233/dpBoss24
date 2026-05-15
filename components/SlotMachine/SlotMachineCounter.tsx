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
  onComplete?: () => void;
}

export default function SlotMachineCounter({
  value,
  duration = 1200,
  reelCount = 2,
  onComplete,
}: SlotMachineCounterProps): JSX.Element {
  const [displayedDigits, setDisplayedDigits] = useState<number[]>(
    Array(reelCount).fill(-1)
  );
  const [spinningReels, setSpinningReels] = useState<boolean[]>(
    Array(reelCount).fill(false)
  );
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const isSpinning = spinningReels.some((isSpinning) => isSpinning);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Audio context and nodes for coin sound
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Set mounted state for initial animation
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.connect(audioContextRef.current.destination);

      return () => {
        // Clean up all oscillators
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            console.warn("Error cleaning up oscillator:", e);
          }
        });
        oscillatorsRef.current = [];

        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
        }

        if (audioContextRef.current?.state !== "closed") {
          audioContextRef.current?.close();
        }
      };
    } catch (e) {
      console.error("Error initializing audio:", e);
    }
  }, []);

  // Control tik-tik sound based on spinning state
  useEffect(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const audioContext = audioContextRef.current;
    let tikInterval: NodeJS.Timeout;

    const playTikSound = () => {
      if (!audioContextRef.current) return;

      const now = audioContextRef.current.currentTime;
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      // Create a short, sharp "tik" sound with more presence
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);

      // Stronger, punchier envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.001); // Faster attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Slightly longer decay

      // Connect and start
      osc.connect(gain);
      gain.connect(gainNodeRef.current!);
      osc.start(now);
      osc.stop(now + 0.05);

      // Clean up
      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (e) {
          console.warn("Error cleaning up tik sound:", e);
        }
      }, 100);
    };

    if (isSpinning) {
      // Resume audio context if needed
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.error);
      }

      // Set initial volume (higher for better audibility)
      gainNodeRef.current.gain.cancelScheduledValues(audioContext.currentTime);
      gainNodeRef.current.gain.value = 0.5;

      // Start with an immediate tick
      playTikSound();

      // Set up interval for continuous ticking
      tikInterval = setInterval(() => {
        if (isSpinning) {
          playTikSound();
        }
      }, 150); // Adjust speed of tik-tik sound here (smaller = faster)

      return () => {
        clearInterval(tikInterval);
        // Fade out
        if (gainNodeRef.current) {
          const now = audioContext.currentTime;
          gainNodeRef.current.gain.cancelScheduledValues(now);
          gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.1);
        }
      };
    } else {
      // Fade out when stopping
      if (gainNodeRef.current) {
        const now = audioContext.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.1);
      }
    }
  }, [isSpinning]);

  // Call onComplete when all reels have stopped spinning
  useEffect(() => {
    if (
      !isSpinning &&
      !isRolling &&
      displayedDigits[0] !== -1 &&
      onCompleteRef.current
    ) {
      onCompleteRef.current();
    }
  }, [isSpinning, isRolling, displayedDigits]);

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

        // Calculate duration with some randomness for a more natural feel
        const reelDuration = 15000; // 1-1.5 seconds per reel

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
          }, i * 300 + reelDuration); // Stagger the reels by 300ms
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative inline-block transition-all duration-1000 ease-out transform"
      style={{
        perspective: "1500px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.98)",
        transition:
          "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      <style jsx global>
        {`
          @keyframes reel-spin {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(calc(-112px * 10));
            }
          }
          .reel.is-rolling {
            animation: reel-spin var(--reel-spin-duration) linear infinite;
          }
          .reel.is-spinning {
            transition: transform var(--spin-duration)
              cubic-bezier(0.25, 0.1, 0.25, 1);
          }
          .slot-machine-enter {
            opacity: 0;
            transform: translateY(20px) rotateY(-8deg) rotateX(3deg);
          }
          .slot-machine-enter-active {
            opacity: 1;
            transform: translateY(0) rotateY(-8deg) rotateX(3deg);
            transition: opacity 800ms ease-out,
              transform 800ms cubic-bezier(0.23, 1, 0.32, 1);
          }
        `}
      </style>

      <div
        className={`relative px-8 py-6 rounded-[2rem] transition-all duration-800 ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } slot-machine-enter ${isMounted ? "slot-machine-enter-active" : ""}`}
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
