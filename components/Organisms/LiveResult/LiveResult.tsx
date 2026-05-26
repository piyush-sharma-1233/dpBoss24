/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getAllVideoLinks, getLuckyNumbers } from "@/app/actions/action";
import TableComponent from "@/components/TableComponent";
// import VideoComponent from "@/components/VideoComponent";
// import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Banner from "./Banner";
import moment from "moment";
import NumberRibbon from "@/components/NumberRibbon/NumberRibbon";
// import rsLogo from "../../../public/assets/images/rs-logo.png";
// const VideoComponent = dynamic(
//   () => import("@/components/VideoComponent/index"),
//   {
//     ssr: false,
//   }
// );
const LiveResult: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLoading] = useState(true);
  const [currentNumber, setCurrentNumber] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [rollingComplete, setRollingComplete] = useState(false);
  const [currentResultTime, setCurrentResultTime] = useState("");
  const [result, setResult] = useState<
    {
      number: string;
      id: number;
      date: string;
      time: string;
      userId: number;
    }[]
  >([]);
  const [videos, setVideos] = useState<
    {
      videoLink: string;
      id: number;
      userId: number;
    }[]
  >([]);
  const nextTriggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchResults = async () => {
    try {
      const response = await getLuckyNumbers({
        date: moment().format("YYYY-MM-DD"),
      });
      setResult(response);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };
  const fetchVideos = async () => {
    try {
      const videoLinks = await getAllVideoLinks(); // Fetch all video links
      setVideos(videoLinks); // Set the videos in the state
      setLoading(false);
    } catch {
      setLoading(false);
      // console.log("Error fetching videos:", error);
    }
  };

  const scheduleNextTrigger = useCallback(() => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();

    // Clear any existing scheduled trigger to avoid duplicates (StrictMode, re-renders)
    if (nextTriggerTimeoutRef.current) {
      clearTimeout(nextTriggerTimeoutRef.current);
      nextTriggerTimeoutRef.current = null;
    }

    // Calculate time until next :00 or :30 correctly
    const minutesToNext =
      currentMinutes < 30 ? 30 - currentMinutes : 60 - currentMinutes;
    let delaySeconds = minutesToNext * 60 - currentSeconds;
    if (delaySeconds <= 0) delaySeconds = 30 * 60;
    const delay = delaySeconds * 1000; // Convert to milliseconds

    // Schedule the next trigger
    nextTriggerTimeoutRef.current = setTimeout(async () => {
      // Schedule the next boundary immediately to avoid chaining inside hide
      scheduleNextTrigger();

      const m = moment();
      const h24 = m.hours();
      const mm = m.minutes();
      const inScheduleNow = h24 >= 10 && h24 <= 21;
      // Only run at exact XX:00 or XX:30 and within schedule window
      if (!inScheduleNow || !(mm === 0 || mm === 30)) {
        return;
      }

      try {
        const response = await getLuckyNumbers({
          date: m.format("YYYY-MM-DD"),
        });
        setResult(response);

        const period = h24 >= 12 ? "PM" : "AM";
        const h12 = h24 % 12 || 12;
        const hh = h12 < 10 ? `0${h12}` : `${h12}`;
        const minuteStr = mm === 0 ? "00" : "30";
        const keyTime = `${hh}:${minuteStr} ${period}`;
        const entry = response.find((item: any) => item.time === keyTime);
        if (entry?.number) {
          setCurrentNumber(String(entry.number));
          setCurrentTime(entry?.time);
          setRollingComplete(false); // Reset for new result
          setCurrentResultTime(keyTime); // Track which time is currently rolling
          setIsVisible(true);

          // Hide the component after 1 minute
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 60 * 1000);
        } else {
          setIsVisible(false);
        }
      } catch (err) {
        console.error("scheduleNextTrigger error:", err);
      }
    }, delay);
  }, []);

  useEffect(() => {
    fetchResults();
    fetchVideos();
  }, []);

  useEffect(() => {
    scheduleNextTrigger();
    return () => {
      if (nextTriggerTimeoutRef.current) {
        clearTimeout(nextTriggerTimeoutRef.current);
        nextTriggerTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [scheduleNextTrigger]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsVisible(true);
  //   }, 20000);
  // }, []);

  const videoLinks = videos.map((video) => video.videoLink);
  const sources = videoLinks;
  console.log("sources", sources);
  return (
    <div className="w-full h-full flex flex-col gap-5 2xl:container mx-auto">
      {isVisible ? (
        <div className="relative overflow-hidden">
          <Banner
            currentNumber={currentNumber}
            currentTime={currentTime}
            onRollingComplete={() => setRollingComplete(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-5 mt-5">
          <div className="flex justify-center px-2 py-2 border-2 border-red-500 rounded w-full max-w-6xl mx-auto items-center bg-transparent relative shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
            <div className="relative overflow-hidden w-full aspect-[16/9] ">
              {/* LIVE Button */}
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-2 py-1 lg:px-4 lg:py-2 rounded-full shadow-lg animate-pulse z-10">
                LIVE
              </div>
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingTop: '56.25%' }}>
                <iframe
                  width="560"
                  height="300"
                  src="https://amigofx.com:2020/VideoPlayer/dpboss24?autoplay=1"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  scrolling="no"
                  frameBorder="0"
                  allow="autoplay"
                  allowFullScreen

                />
              </div>
            </div>
          </div>
        </div>
      )}
      <NumberRibbon
        logos={result}
        rollingComplete={rollingComplete}
        currentResultTime={currentResultTime}
      />
      <div className="relative overflow-x-auto shadow-[0_0_20px_0_rgba(0,0,0,0.4)] ">
        <TableComponent
          data={result}
          rollingComplete={rollingComplete}
          currentResultTime={currentResultTime}
        />
      </div>
      {/* <div className="flex relative items-center justify-center overflow-x-auto ">
        <JodiTable data={result} />
      </div> */}
    </div>
  );
};

export default LiveResult;
