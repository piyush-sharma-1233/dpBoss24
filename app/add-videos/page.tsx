import AddVideo from "@/components/Organisms/AddVideo/AddVideo";
// import TableWithFilterAndPagination from "@/components/TableWithFilterAndPagination";
// import VideoTable from "@/components/VideoTable/VideoTable";
import React from "react";
// const sampleData = [
//   {
//     name: "Alice",
//     email: "alice@example.com",
//     role: "Admin",
//     date: "2023-12-01",
//   },
//   {
//     name: "Bob",
//     email: "bob@example.com",
//     role: "Editor",
//     date: "2023-12-02",
//   },
//   {
//     name: "Charlie",
//     email: "charlie@example.com",
//     role: "User",
//     date: "2023-12-01",
//   },
//   {
//     name: "Diana",
//     email: "diana@example.com",
//     role: "Admin",
//     date: "2023-12-03",
//   },
//   {
//     name: "Eve",
//     email: "eve@example.com",
//     role: "Editor",
//     date: "2023-12-02",
//   },
//   {
//     name: "Frank",
//     email: "frank@example.com",
//     role: "User",
//     date: "2023-12-03",
//   },
//   // Add more rows as needed
// ];
// const columns = ["name", "email", "role", "date"];
// const videoData = [
//   { title: "Introduction to React", uploadDate: "2024-01-01" },
//   { title: "Understanding Redux Toolkit", uploadDate: "2024-01-02" },
//   { title: "Mastering Next.js", uploadDate: "2024-01-03" },
//   { title: "Building Components with Tailwind", uploadDate: "2024-01-04" },
//   { title: "Testing with Cypress", uploadDate: "2024-01-05" },
//   { title: "React Hooks Deep Dive", uploadDate: "2024-01-06" },
//   { title: "State Management in React", uploadDate: "2024-01-07" },
//   { title: "Deploying with Vercel", uploadDate: "2024-01-08" },
//   { title: "Optimizing React Apps", uploadDate: "2024-01-09" },
//   { title: "Accessibility in React", uploadDate: "2024-01-10" },
// ];
// const columns = ["title", "uploadDate", "actions"];

export default function AddVideos() {
  return (
    <div className="flex flex-col p-5 gap-4 w-full font-[family-name:var(--font-geist-sans)] min-h-screen">
      <AddVideo />
      {/* <Table data={videoData} columns={columns} /> */}
      {/* <VideoTable /> */}
      {/* <TableWithFilterAndPagination data={videoData} columns={columns} /> */}
    </div>
  );
}
