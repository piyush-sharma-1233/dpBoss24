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

/* ─── Spinning digit ─────────────────────────────────────────────────────── */
function SpinningDigit({
  finalDigit,
  onComplete,
  fontSize,
}: {
  finalDigit: number;
  onComplete: () => void;
  fontSize: number;
}) {
  const [digit, setDigit]     = useState(0);
  const [settled, setSettled] = useState(false);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /* ── Audio ─────────────────────────────────────────────────────────────
     Uses Web Audio API with webkitAudioContext fallback (covers all TV
     browsers). AudioContext is created lazily and resumed aggressively
     because TV browsers often start in "suspended" state.
  ─────────────────────────────────────────────────────────────────────── */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef     = useRef<GainNode | null>(null);

  const getAudioCtx = (): AudioContext | null => {
    if (audioCtxRef.current) return audioCtxRef.current;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ctx  = new AC() as AudioContext;
      const gain = ctx.createGain();
      gain.gain.value = 0.35;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current     = gain;
      return ctx;
    } catch { return null; }
  };

  const resumeCtx = (ctx: AudioContext) => {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      try { audioCtxRef.current?.close(); } catch { /* ignore */ }
      audioCtxRef.current = null;
    };
  }, []);

  /* Same pitch on every tick — only interval speed changes per phase */
  const playTick = () => {
    const ctx = getAudioCtx();
    const gn  = gainRef.current;
    if (!ctx || !gn) return;
    resumeCtx(ctx);
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type  = "sine";
      osc.frequency.setValueAtTime(1200, now);
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.5, now + 0.002);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(env);
      env.connect(gn);
      osc.start(now);
      osc.stop(now + 0.045);
      osc.onended = () => { try { osc.disconnect(); env.disconnect(); } catch { /* ignore */ } };
    } catch { /* ignore */ }
  };

  /* C–E–G major triad when digit locks */
  const playSettle = () => {
    const ctx = getAudioCtx();
    const gn  = gainRef.current;
    if (!ctx || !gn) return;
    resumeCtx(ctx);
    [0, 0.12, 0.24].forEach((delay, i) => {
      const freq = [1047, 1319, 1568][i];
      try {
        const now = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type  = "sine";
        osc.frequency.setValueAtTime(freq, now);
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.45, now + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(env); env.connect(gn);
        osc.start(now); osc.stop(now + 0.65);
        osc.onended = () => { try { osc.disconnect(); env.disconnect(); } catch { /* ignore */ } };
      } catch { /* ignore */ }
    });
  };

  useEffect(() => {
    if (isNaN(finalDigit)) return;
    setSettled(false);
    setDigit(0);

    let phaseIdx = 0, stepCount = 0, cur = 0;

    const tick = () => {
      cur = (cur + 1) % 10;
      setDigit(cur);
      stepCount++;
      playTick();

      const [, steps] = SPIN_PHASES[phaseIdx];
      if (stepCount >= steps) {
        phaseIdx++; stepCount = 0;
        if (phaseIdx >= SPIN_PHASES.length) {
          setDigit(finalDigit);
          setSettled(true);
          playSettle();
          timerRef.current = setTimeout(() => onCompleteRef.current(), 800);
          return;
        }
      }
      timerRef.current = setTimeout(tick, SPIN_PHASES[phaseIdx][0]);
    };

    timerRef.current = setTimeout(tick, SPIN_PHASES[0][0]);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalDigit]);

  /* ── 3-D chrome / glow filter strings ──────────────────────────────── */
  const spinFilter = [
    "drop-shadow(2px 3px 0 rgba(100,100,100,0.85))",
    "drop-shadow(3px 5px 0 rgba(70,70,70,0.65))",
    "drop-shadow(4px 7px 0 rgba(40,40,40,0.45))",
    "drop-shadow(0 10px 8px rgba(0,0,0,0.45))",
  ].join(" ");

  const settleFilter = [
    "drop-shadow(2px 3px 0 rgba(100,100,100,0.9))",
    "drop-shadow(3px 5px 0 rgba(70,70,70,0.7))",
    "drop-shadow(4px 7px 0 rgba(40,40,40,0.5))",
    "drop-shadow(0 12px 10px rgba(0,0,0,0.55))",
    "drop-shadow(0 0 14px rgba(255,255,255,0.7))",
  ].join(" ");

  return (
    <>
      <style jsx global>{`
        @keyframes digit-settle {
          0%   { -webkit-transform: scale(1);    transform: scale(1); }
          35%  { -webkit-transform: scale(1.1);  transform: scale(1.1); }
          65%  { -webkit-transform: scale(0.96); transform: scale(0.96); }
          100% { -webkit-transform: scale(1);    transform: scale(1); }
        }
        @keyframes digit-glow {
          0%, 100% {
            -webkit-filter: drop-shadow(0 0 6px rgba(255,255,255,0.5));
                    filter: drop-shadow(0 0 6px rgba(255,255,255,0.5));
          }
          50% {
            -webkit-filter: drop-shadow(0 0 18px rgba(255,255,255,0.95));
                    filter: drop-shadow(0 0 18px rgba(255,255,255,0.95));
          }
        }
      `}</style>

      <span
        style={{
          /*
           * JS-computed px font size — no clamp() or vw needed.
           * Works in all browsers including Chrome 47 (Tizen 5).
           */
          fontSize:   fontSize + "px",
          fontWeight:  900,
          fontFamily: "'Arial Black', Impact, 'Haettenschweiler', Arial, sans-serif",
          lineHeight:  1,
          userSelect: "none",
          display:    "block",

          /* White → silver gradient face */
          background:           "linear-gradient(to bottom, #ffffff 0%, #f2f2f2 45%, #d8d8d8 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip:       "text",
          WebkitTextFillColor:  "transparent",

          /* -webkit-filter for old TV webkit engines, filter for modern */
          WebkitFilter: settled ? settleFilter : spinFilter,
          filter:       settled ? settleFilter : spinFilter,

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
  onRollingComplete,
}: {
  currentNumber: string;
  currentTime: string;
  onRollingComplete?: () => void;
}): JSX.Element => {
  const counter = Number(currentNumber);
  const [showBackground, setShowBackground] = useState(false);
  const [showDigit, setShowDigit]           = useState(false);

  /*
   * JS-computed font size so it works on Chrome 47 (no clamp/vw support).
   * 15% of container width, floored at 40px and capped at 210px.
   */
  const [fontSize, setFontSize] = useState(80);
  useEffect(() => {
    const calc = () => {
      const vw   = window.innerWidth;
      const size = Math.round(vw * 0.15);
      setFontSize(Math.min(Math.max(size, 40), 210));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    return () => { try { synthRef.current?.cancel(); } catch { /* ignore */ } };
  }, []);

  const handleCurtainComplete = () => {
    setShowBackground(true);
    setTimeout(() => setShowDigit(true), 2000);
  };

  const handleDigitComplete = () => {
    onRollingComplete && onRollingComplete();
    speak("The final number is " + counter + ".");
  };

  return (
    /*
     * 16:9 layout via padding-top: 56.25% trick — works in ALL browsers
     * including Chrome 47 (Tizen 5) which does not support aspect-ratio CSS.
     * The <main> fills the box absolutely.
     */
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <main
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: "#000000",
          ...(showBackground && {
            backgroundImage:    "url('/assets/bg.png')",
            backgroundSize:     "cover",
            backgroundPosition: "center center",
            backgroundRepeat:   "no-repeat",
          }),
        }}
      >
        {/* Curtain intro until bg is ready */}
        {!showBackground && <CurtainIntro onComplete={handleCurtainComplete} />}

        {/* Spinning number — absolutely centred over the golden disc */}
        {showDigit && (
          <div
            className="absolute"
            style={{
              top:       "49.5%",
              left:      "49.5%",
              WebkitTransform: "translate(-50%, -50%)",
              transform:       "translate(-50%, -50%)",
            }}
          >
            <SpinningDigit
              finalDigit={counter}
              onComplete={handleDigitComplete}
              fontSize={fontSize}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Banner;
