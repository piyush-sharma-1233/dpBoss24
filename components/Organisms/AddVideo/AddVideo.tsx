/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { createVideoLink, deleteVideoLink } from "@/app/actions/action";
import VideoTable from "@/components/VideoTabled";
import { getAllVideoLinks } from "@/app/actions/action"; // Ensure the correct import path
import { useSession } from "next-auth/react";

const AddVideo: React.FC = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<
    {
      videoLink: string;
      id: number;
      userId: number;
    }[]
  >([]);
  const fetchVideos = async () => {
    try {
      const videoLinks = await getAllVideoLinks(); // Fetch all video links
      setVideos(videoLinks); // Set the videos in the state
    } catch (error: any) {
      console.log("Error fetching videos:", error);
    }
  };
  // Fetch all video links when the component mounts
  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      // Call the API function to delete the video
      const deletedVideo = await deleteVideoLink(id);
      if (deletedVideo) {
        await fetchVideos();
      }
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a video file.");
      return;
    }
    if (!(session && session?.user && session?.user?.id)) {
      alert("Not authenticated");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const presignRes = await fetch("/api/s3/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { url, fileUrl, contentType } = (await presignRes.json()) as {
        url: string;
        fileUrl: string;
        contentType: string;
      };

      console.log('url', url)

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload to S3");
      }

      const videoResponse = await createVideoLink({
        videoLink: fileUrl,
        userId: Number(session.user.id),
      });

      if (videoResponse) {
        await fetchVideos();
      }

      closeModal();
    } catch (error: any) {
      console.error("Error creating/updating video:", error);
      setError(error?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setError(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 2xl:container mx-auto">
      <div className="flex flex-col gap-2 justify-items-start items-start">
        <h1>Manage Videos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-red-500 text-white rounded-md shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
        >
          Add Video
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Upload Video
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="videoFile"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Select Video
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  className="w-full"
                  onChange={onFileChange}
                />
                {file && <p className="text-sm text-gray-600 mt-1">{file.name}</p>}
                {error && (
                  <p className="text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 bg-indigo-500 text-white rounded shadow focus:ring focus:ring-indigo-300 ${!file || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload & Save"}
              </button>
            </form>
          </div>
        </div>
      )}
      <VideoTable
        data={videos}
        columns={[{ key: "videoLink", label: "Video Link" }]}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AddVideo;
