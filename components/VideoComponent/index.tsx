"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy load ReactPlayer
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoData {
  id: number;
  videoLink: string;
  userId: number;
}

interface VideoComponentProps {
  videosData: VideoData[];
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videosData }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videosData || videosData.length === 0) {
      console.warn("No valid videos provided.");
      return;
    }
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videosData.length);
    }, 60000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [videosData]);

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center">
      {isLoading && (
        <div className="absolute px-2 py-2 m-2 w-full h-full flex items-center justify-center bg-gradient-radial from-[#001833] via-[#001833] to-[#082A4F] text-white font-bold text-5xl">
          OFFLINE
        </div>
      )}
      <ReactPlayer
        url={videosData[currentVideoIndex]?.videoLink} // Use videoLink from the videosData array
        width="100%"
        height="80vh"
        className="pointer-events-none [*&>video]:object-cover"
        playing
        controls={true}
        onReady={() => setIsLoading(false)}
        pip={false}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              showinfo: 0,
              rel: 0,
              controls: 0,
              fs: 0,
              disablekb: 1,
              iv_load_policy: 3,
              preload: 0,
            },
          },
        }}
      />
      <button className="absolute cursor-not-allowed bottom-4 right-4 px-12 py-3 bg-red-500 text-white">
        {isLoading ? "Loading..." : "Live"}
      </button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VideoComponent), { ssr: false });
