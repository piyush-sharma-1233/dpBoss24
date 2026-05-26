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
    <div className="relative overflow-hidden" style={{ width: "1.2em", height: "1.4em" }}>
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
            className="flex items-center justify-center w-full"
            style={{ height: "112px" }}
          >
            {num}
          </div>
        ))}
      </div>
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
  const isSpinning = spinningReels.some((isSpinning) => isSpinning);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Audio context and nodes for coin sound
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

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
        `}
      </style>

      <div className="flex relative z-10">
        {digits.map((digit: number, index: number) => (
          <SlotReel
            key={index}
            targetNumber={digit}
            duration={1000}
            delay={0}
            isSpinning={spinningReels[index]}
            isRolling={isRolling || spinningReels[index]}
          />
        ))}
      </div>
    </div>
  );
}
