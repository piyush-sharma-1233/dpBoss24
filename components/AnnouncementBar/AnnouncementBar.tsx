/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import styles from "./AnnouncementBar.module.css";
// Import the CSS file

const AnnouncementBar = ({ title }: { title: any }) => {
  const newTitle = [title, title, title];

  const clonedNewTitle = [...newTitle, ...newTitle];

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return visible ? (
    <div className="flex flex-row items-center justify-between gap-5 overflow-hidden bg-gray-700">
      <div className="flex flex-row gap-4" style={{ maxWidth: "80%" }}>
        {clonedNewTitle.map((item, index) => (
          <div className="" key={index}>
            <p
              className={`${styles.carousel} whitespace-nowrap py-4 mx-5 capitalize text-white`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
      <div
        className="z-10 cursor-pointer bg-iconBgGrey p-4 py-4"
        onClick={handleClose}
      ></div>
    </div>
  ) : null;
};

export default AnnouncementBar;
