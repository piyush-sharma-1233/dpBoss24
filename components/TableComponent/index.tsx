/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import React, { useState, useEffect } from "react";
import { times } from "@/lib/times";

// Build 12 time pairs: [[times[0],times[1]], [times[2],times[3]], ...]
const timePairs: [string, string][] = [];
for (let i = 0; i + 1 < times.length; i += 2) {
  timePairs.push([times[i], times[i + 1]]);
}

const redColour = [
  "00", "50", "05", "55",
  "11", "61", "16", "66",
  "22", "72", "27", "77",
  "33", "83", "38", "88",
  "44", "94", "49", "99",
];

const TableComponent: React.FC<{
  data: any[];
  rollingComplete?: boolean;
  currentResultTime?: string;
}> = ({ data, rollingComplete = true, currentResultTime = "" }) => {
  const [, setTick] = useState(Date.now());

  // Re-render every 30 s so time-gating updates live
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const hasTimePassed = (timeStr: string) =>
    moment().isAfter(moment(timeStr, "hh:mm A").add(1, "minutes"));

  const shouldShow = (timeStr: string, digit: string) => {
    if (!digit) return false;
    if (timeStr === currentResultTime) return rollingComplete;
    return hasTimePassed(timeStr);
  };

  const jodiColor = (jodi: string) => {
    // Only colour when both digits are real (no placeholder "-")
    if (jodi.includes("-")) return "black";
    const last2 = jodi.padStart(2, "0").slice(-2);
    return redColour.includes(last2) ? "red" : "black";
  };

  const getDigit = (timeStr: string): string => {
    const entry = data.find((item: any) => item.time === timeStr);
    const raw = entry?.number ?? "";
    return shouldShow(timeStr, raw) ? raw : "";
  };

  return (
    <div className="w-full overflow-x-auto shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
      <table
        className="w-full border-2 border-red-500 bg-yellow-100 font-sans"
        style={{ borderCollapse: "collapse", minWidth: "320px" }}
      >
        {/* ── Header ── */}
        <thead>
          <tr className="bg-yellow-200 text-[#e91e63] font-bold text-xs sm:text-sm">
            <th className="border border-red-500 px-2 py-2 text-center w-[22%]">
              Time
            </th>
            <th className="border border-red-500 px-2 py-2 text-center w-[14%]">
              Result
            </th>
            <th className="border border-red-500 px-2 py-2 text-center w-[16%]">
              Jodi
            </th>
            <th className="border border-red-500 px-2 py-2 text-center w-[14%]">
              Result
            </th>
            <th className="border border-red-500 px-2 py-2 text-center w-[22%]">
              Time
            </th>
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody className="text-sm sm:text-base font-semibold italic">
          {timePairs.map(([t1, t2], idx) => {
            const leftDigit  = getDigit(t1);
            const rightDigit = getDigit(t2);

            const jodi =
              (leftDigit || "-") + (rightDigit || "-");

            const color = jodiColor(jodi);

            return (
              <tr key={idx} className="border border-red-500">
                {/* Left time */}
                <td className="border border-red-500 text-center px-1 py-[3px] text-xs sm:text-sm whitespace-nowrap">
                  {t1}
                </td>

                {/* Left result */}
                <td className="border border-red-500 text-center px-1 py-[3px] text-base sm:text-lg font-bold">
                  <span className="text-black">
                    {leftDigit || "-"}
                  </span>
                </td>

                {/* Jodi — center highlight */}
                <td className="border border-red-500 text-center px-1 py-[3px]">
                  <span
                    className="font-extrabold text-lg sm:text-xl"
                    style={{ color }}
                  >
                    {jodi}
                  </span>
                </td>

                {/* Right result */}
                <td className="border border-red-500 text-center px-1 py-[3px] text-base sm:text-lg font-bold">
                  <span className="text-black">
                    {rightDigit || "-"}
                  </span>
                </td>

                {/* Right time */}
                <td className="border border-red-500 text-center px-1 py-[3px] text-xs sm:text-sm whitespace-nowrap">
                  {t2}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
