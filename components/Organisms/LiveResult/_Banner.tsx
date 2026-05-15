/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

let called = false;
export const Banner = ({ currentNumber }: { currentNumber: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>(100);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [showLotteryScreen, setShowLotteryScreen] = useState<boolean>(false);
  const lotteryScreenRef = useRef<HTMLDivElement | null>(null);
  const ticketRef = useRef<any>(null);
  const doorsRef = useRef<HTMLDivElement[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to manage the audio element

  const handleUserClick = () => {
    setIsUserInteracted(true);
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.currentTime = 0;
      playAudio();
    }
  };

  const playAudio = async () => {
    if (!isUserInteracted) return;

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        // console.log("▶️ Audio is playing...");
      } catch (err) {
        console.error("❌ Audio play failed:", err);
      }
    }
  };

  useEffect(() => {
    setIsUserInteracted(true);
    getStatus();
    handleUserClick();
    called = false;
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  useEffect(() => {
    const enableAudio = () => {
      setIsUserInteracted(true); // Mark user interaction
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current
          .play()
          .catch((err) => console.error("Audio play error:", err));
      }
    };

    document.addEventListener("touchstart", enableAudio, { once: true });
    document.addEventListener("click", enableAudio, { once: true });

    return () => {
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("click", enableAudio);
    };
  }, []);

  const speakNumber = (number: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(number);
      utterance.lang = "en-IN"; // Set Indian English

      // Get available voices and select an Indian female voice
      const voices = window.speechSynthesis.getVoices();
      const indianFemaleVoice = voices.find(
        (voice) =>
          voice.name.includes("India") ||
          voice.name.includes("Google UK English Female")
      );

      if (indianFemaleVoice) {
        utterance.voice = indianFemaleVoice;
      }

      utterance.rate = 0.5; // Adjust speed if needed
      window.speechSynthesis.speak(utterance);
    } else {
      // console.log("Speech synthesis is not supported in this browser.");
    }
  };

  const getStatus = async () => {
    try {
      setTimeLeft(100);
      setTimeout(async () => {
        setShowLotteryScreen(true);
        apple();
      }, 2000); // Show lottery screen after 2 seconds
    } catch (error) {
      console.error("Error in getStatus:", error);
    }
  };

  const apple = () => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    setTimeout(() => {
      spin();
    }, 3000); // Spin after 30 seconds
    const init = async (firstInit = true, groups = 1, duration = 1) => {
      const resultArray = currentNumber.split("");

      doorsRef.current.forEach((door: any, index: number) => {
        if (!firstInit && door.dataset.spinned === "1") return;
        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);
        const pool = firstInit
          ? ["❓"]
          : [...Array(groups).fill(items).flat(), resultArray[index]];
        boxesClone.addEventListener(
          "transitionstart",
          () => {
            door.dataset.spinned = "1";
            boxesClone.querySelectorAll(".box").forEach((box: any) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          () => {
            boxesClone
              .querySelectorAll(".box")
              .forEach((box: any, idx: any) => {
                box.style.filter = "blur(0)";
                if (idx > 0) boxesClone.removeChild(box);
              });
          },
          { once: true }
        );
        pool.reverse().forEach((item) => {
          const box = document.createElement("div");
          box.classList.add("box");
          box.style.width = "100%";
          box.style.height = "100%";
          box.textContent = item;
          boxesClone.appendChild(box);
        });
        boxesClone.style.transitionDuration = `${duration}s`;
        boxesClone.style.transform = `translateY(-${
          door.clientHeight * (pool.length - 1)
        }px)`;
        door.replaceChild(boxesClone, boxes);
      });
    };

    // const spin = async () => {
    //   if (audioRef.current && audioRef.current.readyState >= 2) {
    //     setIsUserInteracted(true);
    //     audioRef?.current?.load();
    //     audioRef.current
    //       .play()
    //       .catch((err) => console.log("Error playing audio", err));
    //   }
    //   await init(false, 1, 2);
    //   for (const door of doorsRef.current) {
    //     if (!door) continue;
    //     const boxes = door.querySelector<HTMLDivElement>(".boxes");
    //     if (!boxes) continue;
    //     const duration = parseInt(boxes.style.transitionDuration);
    //     boxes.style.transform = "translateY(0)";
    //     await new Promise((resolve) => setTimeout(resolve, duration * 1000));

    //   }
    //   const sumOfDigits = (number: number) => {
    //     let sum = 0;
    //     while (number > 0) {
    //       sum += number % 10;
    //       number = Math.floor(number / 10);
    //     }
    //     return sum;
    //   };
    //   if (ticketRef.current && !called) {
    //     called = true;
    //     const final = currentNumber
    //       ? String(sumOfDigits(parseInt(currentNumber))).slice(-1)
    //       : "";
    //     ticketRef.current.innerText = ` ${currentNumber
    //       .split("")
    //       .join(" ")} - ${String(final)}`;
    //     speakNumber(`The final number is`);
    //     setTimeout(() => {
    //       speakNumber(currentNumber[0]);
    //     }, 2000);
    //     setTimeout(() => {
    //       speakNumber(currentNumber[1]);
    //     }, 2000);
    //     setTimeout(() => {
    //       speakNumber(currentNumber[2]);
    //     }, 2000);
    //   }
    //   setTimeLeft(60);
    //   setTimeout(async () => {
    //     await getStatus();
    //   }, 62000); // Reset status after 62 seconds
    // };
    const spin = async () => {
      if (audioRef.current && audioRef.current.readyState >= 2) {
        setIsUserInteracted(true);
        audioRef.current.muted = false;
        audioRef.current.currentTime = 0; // start from beginning
        audioRef.current
          .play()
          .catch((err) => console.log("Error playing audio", err));
      }

      // First, prepare all doors but don't spin them yet
      await init(false, 1, 2);

      for (let i = 0; i < doorsRef.current.length; i++) {
        const door = doorsRef.current[i];
        if (!door) continue;

        const boxes = door.querySelector<HTMLDivElement>(".boxes");
        if (!boxes) continue;

        const duration = parseInt(boxes.style.transitionDuration);

        // Spin this digit
        boxes.style.transform = "translateY(0)";

        // Wait for spin animation to finish
        await new Promise((resolve) => setTimeout(resolve, duration * 1000));

        // Add 15 sec delay before spinning the next digit (but not after the last one)
        if (i < doorsRef.current.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 sec delay
        }
      }
      // Stop background audio once spinning is complete
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const sumOfDigits = (number: number) => {
        let sum = 0;
        while (number > 0) {
          sum += number % 10;
          number = Math.floor(number / 10);
        }
        return sum;
      };

      if (ticketRef.current && !called) {
        called = true;
        const final = currentNumber
          ? String(sumOfDigits(parseInt(currentNumber))).slice(-1)
          : "";
        ticketRef.current.innerText = ` ${currentNumber
          .split("")
          .join(" ")} - ${String(final)}`;
        speakNumber(`The final number is`);
        setTimeout(() => speakNumber(currentNumber[0]), 2000);
        setTimeout(() => speakNumber(currentNumber[1]), 4000);
        setTimeout(() => speakNumber(currentNumber[2]), 6000);
      }

      setTimeLeft(60);
      setTimeout(async () => {
        await getStatus();
      }, 62000);
    };
  };

  return (
    <div>
      <audio
        onClick={handleUserClick}
        ref={audioRef}
        src="./assets/bg_audio.mp3"
        preload="auto"
        loop
      />
      <div
        ref={lotteryScreenRef}
        className={`ticket-container wrapper ${
          showLotteryScreen ? "flex" : "none"
        } flex-col`}
      >
        <img
          src="./assets/pattern/pattern-1.svg"
          alt="pattern-1"
          className="pattern-top pattern"
        />
        <img
          src="./assets/pattern/pattern-3.svg"
          alt="pattern-2"
          className="pattern-top-center pattern"
        />
        <img
          src="./assets/pattern/pattern-2.svg"
          alt="pattern-3"
          className="pattern-top-center-right pattern"
        />
        <img
          src="./assets/pattern/pattern-4.svg"
          alt="pattern-4"
          className="pattern-top-right pattern"
        />
        <img
          src="./assets/pattern/pattern-5.svg"
          alt="pattern-5"
          className="pattern-center-left pattern md"
        />
        <img
          src="./assets/pattern/pattern-6.svg"
          alt="pattern-6"
          className="pattern-center-center md pattern"
        />
        <img
          src="./assets/pattern/pattern-8.svg"
          alt="pattern-8"
          className="pattern-center-right pattern"
        />
        <img
          src="./assets/pattern/pattern-9.svg"
          alt="pattern-9"
          className="pattern-bottom-left pattern"
        />
        <img
          src="./assets/pattern/pattern-9.svg"
          alt="pattern-9"
          className="pattern-bottom-right pattern"
        />
        <div className="w-full">
          <div className="hero-img-container mx-auto mb-3">
            <div className="h2 mb-0 fw-700 win-title text-shadow gradient-text">
              RS STAR LINE
            </div>
            <div className="doors">
              <div
                ref={(el) => {
                  if (el) doorsRef.current[0] = el;
                }}
                className="door win-number win-number-left"
              >
                <div className="boxes">
                  <span className="mb-0 fw-700 text-shadow gradient-text">
                    0
                  </span>
                </div>
              </div>

              <div
                ref={(el) => {
                  if (el) doorsRef.current[1] = el;
                }}
                className="door win-number win-number-center"
              >
                <div className="boxes">
                  <span className="mb-0 fw-700 text-shadow gradient-text">
                    0
                  </span>
                </div>
              </div>

              <div
                ref={(el) => {
                  if (el) doorsRef.current[2] = el;
                }}
                className="door win-number win-number-right"
              >
                <div className="boxes">
                  <span className=" mb-0 fw-700 text-shadow gradient-text">
                    0
                  </span>
                </div>
              </div>
            </div>
            <img
              src="./assets/bg.png"
              alt="hero"
              className="hero-img img-fluid"
            />
          </div>
        </div>
        <div className="text-center w-full">
          <h3 className="text-white">: Result :</h3>
          <h2 className="text-uppercase text-theme flex justify-center">
            Ticket ID:{" "}
            <p ref={ticketRef} className="pl-2">
              ? ? ? - ?
            </p>
          </h2>
        </div>
      </div>
      {/* <button onClick={handleUserClick} ref={audioBtn} className="">
        Play Audio
      </button> */}
    </div>
  );
};
