"use client";
import AnimatedBackground from "@/components/SlotMachine/AnimatedBackground";
import CurtainIntro from "@/components/SlotMachine/CurtainIntro";
import SlotMachineCounter from "@/components/SlotMachine/SlotMachineCounter";
import { useState, useEffect, useRef } from "react";

// Helper function to speak text
const speak = (text: string, rate = 0.3) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = "en-GB";
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
};

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
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const [showSlotMachine, setShowSlotMachine] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Calculate the sum of the counter digits
  const counterSum = counter
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis;
    }

    return () => {
      // Cancel any ongoing speech when component unmounts
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  const handleCurtainComplete = () => {
    // First show background
    setShowBackground(true);
    // Then show slot machine 2 seconds later
    setTimeout(() => {
      setShowSlotMachine(true);
    }, 2000);
  };

  const handleCounterComplete = () => {
    setShowResult(true);

    // Notify parent that rolling is complete
    if (onRollingComplete) {
      onRollingComplete();
    }

    // Speak the result when counter completes
    const resultText = `The final number is ${counter}.`;
    speak(resultText);
  };

  return (
    <main
      className="relative flex items-center justify-center w-full"
      style={{
        background: "#000000",
        height: "calc(100vh - 4rem)", // Full viewport height minus header (assuming 4rem/64px header)
        minHeight: "calc(100vh - 4rem)", // Ensure minimum height is maintained
      }}
    >
      {/* Animated background with fade-in */}
      {showBackground && (
        <div
          className="absolute inset-0 w-full h-full animate-bg-fade-in"
          style={{
            background:
              "linear-gradient(135deg, #a855f7 0%, #9333ea 25%, #c026d3 50%, #db2777 75%, #f472b6 100%)",
          }}
        >
          <AnimatedBackground />
        </div>
      )}

      {!showBackground && <CurtainIntro onComplete={handleCurtainComplete} />}

      {showSlotMachine && (
        <div className="relative z-10 animate-fade-in flex flex-col items-center justify-center">
          <h1
            className="text-[100px] font-bold mb-[35px] relative text-center w-full"
            style={{
              position: "relative",
              display: "block",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 2,
                color: "#f1ff21",
              }}
            >
              Raj Lottery
            </span>
            {/* <span
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                right: "-4px",
                bottom: "-4px",
                background:
                  "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                filter: "blur(12px)",
                opacity: 0.7,
                zIndex: 1,
                borderRadius: "50%",
              }}
            /> */}
          </h1>
          <SlotMachineCounter
            value={counter}
            duration={1200}
            reelCount={2}
            onComplete={handleCounterComplete}
          />

          <p className="text-center mt-[55px] font-bold text-6xl animate-fade-in text-[#fec820]">
            Result {currentTime} =
            {showResult
              ? counterSum >= 10
                ? `${counter} - ${counterSum.toString()[1]}`
                : `${counter} - ${counterSum}`
              : "?? - ?"}
          </p>
        </div>
      )}
    </main>
  );
};
export default Banner;