"use client";
import React, { useState } from "react";

const videoData = [
  { title: "Introduction to React", uploadDate: "2024-01-01" },
  { title: "Understanding Redux Toolkit", uploadDate: "2024-01-02" },
  { title: "Mastering Next.js", uploadDate: "2024-01-03" },
  { title: "Building Components with Tailwind", uploadDate: "2024-01-04" },
  { title: "Testing with Cypress", uploadDate: "2024-01-05" },
  { title: "React Hooks Deep Dive", uploadDate: "2024-01-06" },
  { title: "State Management in React", uploadDate: "2024-01-07" },
  { title: "Deploying with Vercel", uploadDate: "2024-01-08" },
  { title: "Optimizing React Apps", uploadDate: "2024-01-09" },
  { title: "Accessibility in React", uploadDate: "2024-01-10" },
];
const columns = ["title", "uploadDate", "actions"];

const VideoTable = () => {
  const [videos, setVideos] = useState(videoData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtered data based on search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredVideos.length / rowsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleEdit = (index: number) => {
    const updatedTitle = prompt(
      "Edit Video Title:",
      paginatedVideos[index].title
    );
    if (updatedTitle !== null) {
      const globalIndex = (currentPage - 1) * rowsPerPage + index; // Map to global index
      const updatedVideos = [...videos];
      updatedVideos[globalIndex].title = updatedTitle;
      setVideos(updatedVideos);
    }
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const globalIndex = (currentPage - 1) * rowsPerPage + index; // Map to global index
      const updatedVideos = videos.filter((_, i) => i !== globalIndex);
      setVideos(updatedVideos);

      // Adjust the page if the last item on the current page is deleted
      if (currentPage > 1 && paginatedVideos.length === 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="">
      {/* Search Bar */}
      <div className="mb-4 w-fit">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-indigo-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 when filtering
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              {columns.map((column) => (
                <th key={column} className="px-4 py-2 border">
                  {column.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedVideos.length > 0 ? (
              paginatedVideos.map((video, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
                >
                  <td className="px-4 py-2 border">{video.title}</td>
                  <td className="px-4 py-2 border">{video.uploadDate}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="mr-2 px-2 py-1 text-white bg-blue-500 rounded"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoTable;
