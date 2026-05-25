"use client";
import CurtainIntro from "@/components/SlotMachine/CurtainIntro";
import { useState, useEffect, useRef } from "react";

const speak = (text: string, rate = 0.3) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1;
    u.lang = "en-GB";
    u.volume = 1;
    window.speechSynthesis.speak(u);
  }
};

/* ─── Spin phases: [interval_ms, step_count] ─────────────────────────────── */
const SPIN_PHASES: [number, number][] = [
  [55,  30],  // fast   ~1.65 s
  [110, 10],  // medium ~1.1 s
  [200,  7],  // slow   ~1.4 s
  [360,  5],  // crawl  ~1.8 s
];

/* ─── Spinning digit — white 3-D number over the golden disc ─────────────── */
function SpinningDigit({
  finalDigit,
  onComplete,
}: {
  finalDigit: number;
  onComplete: () => void;
}) {
  const [digit, setDigit]     = useState(0);
  const [settled, setSettled] = useState(false);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isNaN(finalDigit)) return;
    setSettled(false);
    setDigit(0);

    let phaseIdx = 0, stepCount = 0, cur = 0;

    const tick = () => {
      cur = (cur + 1) % 10;
      setDigit(cur);
      stepCount++;

      const [, steps] = SPIN_PHASES[phaseIdx];
      if (stepCount >= steps) {
        phaseIdx++; stepCount = 0;
        if (phaseIdx >= SPIN_PHASES.length) {
          setDigit(finalDigit);
          setSettled(true);
          timerRef.current = setTimeout(() => onCompleteRef.current(), 800);
          return;
        }
      }
      timerRef.current = setTimeout(tick, SPIN_PHASES[phaseIdx][0]);
    };

    timerRef.current = setTimeout(tick, SPIN_PHASES[0][0]);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [finalDigit]);

  return (
    <>
      <style jsx global>{`
        @keyframes digit-settle {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.1); }
          65%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes digit-glow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.5)); }
          50%       { filter: drop-shadow(0 0 18px rgba(255,255,255,0.95)); }
        }
      `}</style>

      <span
        style={{
          /*
           * Font scales with the container width so it stays proportional
           * to the golden disc across all viewport sizes.
           * The disc is ~28% of image height = ~16% of image width ≈ 15vw.
           */
          fontSize:   "clamp(40px, 15vw, 210px)",
          fontWeight:  900,
          fontFamily: "'Arial Black', Impact, 'Haettenschweiler', sans-serif",
          lineHeight:  1,
          userSelect: "none",
          display:    "block",

          /* White face with a subtle silver-bottom gradient */
          background: "linear-gradient(to bottom, #ffffff 0%, #f2f2f2 45%, #d8d8d8 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip:       "text",
          WebkitTextFillColor:  "transparent",

          /*
           * Layered shadows build the 3-D white chrome look from the screenshot:
           *  – stacked gray offsets → extrusion depth
           *  – soft spread at the end → cast shadow on the gold disc
           */
          filter: settled
            ? [
                "drop-shadow(2px 3px 0 rgba(100,100,100,0.9))",
                "drop-shadow(3px 5px 0 rgba(70,70,70,0.7))",
                "drop-shadow(4px 7px 0 rgba(40,40,40,0.5))",
                "drop-shadow(0 12px 10px rgba(0,0,0,0.55))",
                "drop-shadow(0 0 14px rgba(255,255,255,0.7))",
              ].join(" ")
            : [
                "drop-shadow(2px 3px 0 rgba(100,100,100,0.85))",
                "drop-shadow(3px 5px 0 rgba(70,70,70,0.65))",
                "drop-shadow(4px 7px 0 rgba(40,40,40,0.45))",
                "drop-shadow(0 10px 8px rgba(0,0,0,0.45))",
              ].join(" "),

          animation: settled
            ? "digit-settle 0.4s ease-out, digit-glow 1.6s ease-in-out 0.4s infinite"
            : "none",
        }}
      >
        {digit}
      </span>
    </>
  );
}

/* ─── Banner ─────────────────────────────────────────────────────────────── */
const Banner = ({
  currentNumber,
  currentTime,
  onRollingComplete,
}: {
  currentNumber: string;
  currentTime: string;
  onRollingComplete?: () => void;
}): JSX.Element => {
  const counter = Number(currentNumber);
  const [showBackground, setShowBackground] = useState(false);
  const [showDigit, setShowDigit]           = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    return () => { synthRef.current?.cancel(); };
  }, []);

  const handleCurtainComplete = () => {
    setShowBackground(true);
    setTimeout(() => setShowDigit(true), 2000);
  };

  const handleDigitComplete = () => {
    onRollingComplete?.();
    speak(`The final number is ${counter}.`);
  };

  return (
    /*
     * 16:9 container — width = min(100vw, available-height × 16/9).
     * Ensures the bg image fills the box perfectly on every screen:
     *   landscape desktop / 4K TV → full-width
     *   portrait mobile           → height-constrained, no cropping
     */
    <main
      className="relative mx-auto flex items-center justify-center overflow-hidden"
      style={{
        width:       "min(100vw, calc((100vh - 4rem) * 16 / 9))",
        aspectRatio: "16 / 9",
        background:  "#000000",
        ...(showBackground && {
          backgroundImage:    "url('/assets/bg.png')",
          backgroundSize:     "100% 100%",
          backgroundRepeat:   "no-repeat",
        }),
      }}
    >
      {/* Curtain intro until bg is ready */}
      {!showBackground && <CurtainIntro onComplete={handleCurtainComplete} />}

      {/* Spinning number — absolutely placed over the golden disc center */}
      {showDigit && (
        <div
          className="absolute"
          style={{
            /*
             * The golden disc in bg.png sits at ~50% horizontal and ~52%
             * vertical within the 16:9 frame.
             */
            top:       "52%",
            left:      "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <SpinningDigit
            finalDigit={counter}
            onComplete={handleDigitComplete}
          />
        </div>
      )}
    </main>
  );
};

export default Banner;
