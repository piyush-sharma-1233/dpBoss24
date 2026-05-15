"use client";
import React, { useEffect, useRef, useState } from "react";

interface VideoStreamerProps {
  sources: string[];
  loading: boolean;
}

const VideoStreamer = ({ sources, loading }: VideoStreamerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % sources.length);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play().catch(() => {});
  }, [currentIndex]);
  if (loading) return <div>Loading...</div>;
  if (!sources.length) return <div>No videos to play</div>;
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain"
      autoPlay
      playsInline
      onEnded={handleEnded}
    >
      <source src={sources[currentIndex]} type="video/mp4" />
    </video>
  );
};

export default VideoStreamer;
