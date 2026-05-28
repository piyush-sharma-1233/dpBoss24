"use client";

import { useState, useEffect, useRef } from "react";

interface CurtainIntroProps {
  onComplete: () => void;
}

const TEXT = "Raj Lottery";
const LETTERS = TEXT.split("");

/**
 * Curtain opening animation with company name reveal
 */
export default function CurtainIntro({
  onComplete,
}: CurtainIntroProps): JSX.Element {
  const [curtainOpen, setCurtainOpen] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  const [visibleLetters, setVisibleLetters] = useState<number>(0);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/assets/ceremony.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5; // Set volume to 50%

      return () => {
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
          bgMusicRef.current = null;
        }
      };
    }
  }, []);

  // Handle letter animation when showName changes
  useEffect(() => {
    if (!showName) return;

    // Wait for curtain to fully close before starting letters
    const letterTimer = setTimeout(() => {
      const timer = setInterval(() => {
        setVisibleLetters((prev) => {
          if (prev >= LETTERS.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(timer);
    }, 1000); // Start letters 500ms after showName becomes true

    return () => clearTimeout(letterTimer as unknown as number);
  }, [showName]);

  // Main animation sequence
  useEffect(() => {
    // Attempt to play music immediately (works on TV browsers / allowed contexts).
    // If blocked by autoplay policy, attach a one-time interaction listener as fallback.
    const tryPlay = () => {
      if (!bgMusicRef.current) return;
      bgMusicRef.current.play().catch(() => {
        // Blocked — wait for first user interaction then retry
        const unlock = () => {
          if (bgMusicRef.current) {
            bgMusicRef.current.play().catch(() => {});
          }
          document.removeEventListener("click",      unlock);
          document.removeEventListener("touchstart", unlock);
          document.removeEventListener("keydown",    unlock);
        };
        document.addEventListener("click",      unlock, { once: true });
        document.addEventListener("touchstart", unlock, { once: true });
        document.addEventListener("keydown",    unlock, { once: true });
      });
    };
    tryPlay();
    const curtainTimer = setTimeout(() => {
      // Start the curtain opening sequence
      setCurtainOpen(true);

      // Show company name container after curtain has fully opened (4 seconds for the transition)
      const nameTimer = setTimeout(() => {
        setShowName(true);

        // After all animations complete, notify parent
        const completionTimer = setTimeout(() => {
          // Fade out background music
          if (bgMusicRef.current) {
            const fadeOutInterval = setInterval(() => {
              if (bgMusicRef.current && bgMusicRef.current.volume > 0.05) {
                bgMusicRef.current.volume = Math.max(
                  0,
                  bgMusicRef.current.volume - 0.05
                );
              } else {
                if (bgMusicRef.current) {
                  bgMusicRef.current.pause();
                  bgMusicRef.current.currentTime = 0;
                  bgMusicRef.current.volume = 0.5; // Reset volume for next time
                }
                clearInterval(fadeOutInterval);
              }
            }, 50);
          }

          onComplete();
        }, 10000); // Wait 5 seconds after showing name before completing

        return () => clearTimeout(completionTimer);
      }, 5000); // Show name after curtain has fully opened (4s transition)

      return () => clearTimeout(nameTimer);
    }, 1000); // Start curtain opening after 1 second

    return () => clearTimeout(curtainTimer);
  }, [onComplete]);

  return (
    <div className="overflow-hidden">
      {/* Left Curtain */}
      <div
        className="absolute overflow-hidden top-0 bottom-0 w-1/2 transition-all duration-[4000ms] ease-in-out"
        style={{
          background:
            "linear-gradient(90deg, #8b0000 0%, #a52a2a 20%, #dc143c 40%, #ff0000 60%, #dc143c 80%, #a52a2a 100%)",
          left: curtainOpen ? "-50%" : "0",
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.5)",
          animation: curtainOpen
            ? "none"
            : "curtainWave 5s ease-in-out infinite",
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
        className="absolute overflow-hidden top-0 bottom-0 w-1/2 transition-all duration-[4000ms] ease-in-out"
        style={{
          background:
            "linear-gradient(270deg, #8b0000 0%, #a52a2a 20%, #dc143c 40%, #ff0000 60%, #dc143c 80%, #a52a2a 100%)",
          right: curtainOpen ? "-50%" : "0",
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.5)",
          animation: curtainOpen
            ? "none"
            : "curtainWave 5s ease-in-out infinite 0.5s",
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
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          showName ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <h1
            className="text-8xl font-bold mb-4"
            style={{
              fontFamily: "Georgia, serif",
              lineHeight: "normal !important",
            }}
          >
            {LETTERS.map((letter: string, index: number) => (
              <span
                key={index}
                className={`inline-block transition-all duration-500 ${
                  index < visibleLetters
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-10 scale-50"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #f0c75e 75%, #d4af37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
                  marginRight: letter === " " ? "0.5em" : "0",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>
          <div
            className="h-1 mx-auto mt-4 rounded-full animate-pulse"
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
