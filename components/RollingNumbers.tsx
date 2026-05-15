/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

const SpinnerLock: React.FC = () => {
  const initialNumbers = [6, 7, 8]; // Initial numbers for each spinner
  const [fixedNumbers, setFixedNumbers] = useState<(number | null)[]>([
    null,
    null,
    null,
  ]);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([0, 0, 0]);
  const [activeIndex, setActiveIndex] = useState<number>(0); // Tracks which spinner is active
  const [isRolling, setIsRolling] = useState<boolean>(true); // Controls when rolling starts/stops
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(
    null
  ); // To store the female voice
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]); // To store all available voices
  console.log(availableVoices);
  const ordinal = (n: number) => {
    const suffix = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return n + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  };

  // Fetch and set the available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices); // Save all voices for debugging

      // Find the first female voice
      const selectedFemaleVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      if (selectedFemaleVoice) {
        setFemaleVoice(selectedFemaleVoice); // Set the female voice once found
      } else {
        //console.log("No female voice found, using default voice.");
      }
    };

    // Initial load of voices
    loadVoices();

    // Retry loading voices after a small delay (e.g., for Chrome)
    setTimeout(loadVoices, 1000);

    // Listen for voices to change (this ensures voices are loaded after the page has loaded)
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null; // Cleanup
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    const speak = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = femaleVoice;
      utterance.pitch = 1; // Normal pitch
      utterance.rate = 0.5; // Slower rate
      speechSynthesis.speak(utterance);
    };

    if (isRolling) {
      // Rolling logic for active spinners
      interval = setInterval(() => {
        setRollingNumbers((prev) =>
          prev.map((num, index) =>
            fixedNumbers[index] === null ? (num + 1) % 10 : num
          )
        );
      }, 100); // Rolling duration: updates every 100ms

      timeout = setTimeout(() => {
        setIsRolling(false);
        // Stop rolling and fix the current spinner after 15 seconds
        // Stop rolling and fix the current spinner after 15 seconds
        const newFixedNumbers = [...fixedNumbers];
        newFixedNumbers[activeIndex] = initialNumbers[activeIndex];
        setFixedNumbers(newFixedNumbers);

        // Announce the fixed number
        speak(
          `${ordinal(activeIndex + 1)} number is ${initialNumbers[activeIndex]}`
        );
      }, 5000); // Rolling duration (15 seconds before stopping)
    } else {
      // Wait for 15 seconds before restarting rolling for the next spinner
      timeout = setTimeout(() => {
        if (activeIndex < 2) {
          setActiveIndex((prev) => prev + 1); // Move to the next spinner
          setIsRolling(true); // Restart rolling
        }
      }, 1000); // Gap duration (15 seconds)
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRolling, activeIndex]);

  let final: any = fixedNumbers.reduce(
    (acc, curr) => (curr != null && acc != null ? acc + curr : curr),
    0
  );
  if (final) {
    let f = final.toString();
    f = f.length ? f[f.length - 1] : "";
    final = f;
  }
  return (
    <div className="flex justify-center items-center w-full gap-4 h-[250px]">
      {rollingNumbers.map((num, index) => (
        <div
          key={index}
          className="w-16 h-20 rounded-md flex justify-center items-center relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-300 to-blue-600 flex justify-center items-center">
            <span className="text-white font-bold text-2xl">
              {fixedNumbers[index] ?? num}
            </span>
          </div>
        </div>
      ))}
      {final ? (
        <>
          <div className="font-bold w-[20px] h-[3px] bg-black" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 flex justify-center items-center">
            <span className="text-white font-bold text-2xl">{final}</span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SpinnerLock;
