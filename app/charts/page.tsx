/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { getAllRowsByMonthYear } from "../actions/action";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { times, daysOfWeek } from "@/lib/times";

interface WeekData {
  [time: string]: { [day: string]: string };
}

// Pair consecutive times: [[times[0],times[1]], [times[2],times[3]], ...]
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

export default function Charts() {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const datePickerRef = useRef<DatePicker>(null);

  const handleWeekChange = (date: Date | null) => {
    if (date) setSelectedWeek(date);
  };

  const getWeekRange = (date: Date) => {
    const start = moment(date).startOf("week");
    const end = moment(date).endOf("week");
    return `${start.format("DD-MM-YYYY")} to ${end.format("DD-MM-YYYY")}`;
  };

  return (
    <div className="flex flex-col py-4 gap-4 px-2 sm:px-4 w-full min-h-screen font-[family-name:var(--font-geist-sans)] bg-yellow-100 2xl:container mx-auto">
      <div className="flex items-center gap-3">
        <DatePicker
          id="weekPicker"
          showIcon
          icon={
            <span
              onClick={() => datePickerRef.current?.setOpen(true)}
              className="text-gray-400 cursor-pointer"
            >
              📅
            </span>
          }
          ref={datePickerRef}
          selected={selectedWeek}
          onChange={handleWeekChange}
          dateFormat="dd/MM/yyyy"
          className="border w-36 sm:w-44 text-center cursor-pointer bg-transparent border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
          placeholderText="Select Week"
        />
        <span className="text-sm sm:text-base font-semibold text-red-600">
          Week: {getWeekRange(selectedWeek)}
        </span>
      </div>

      <MemoizedTable currentDate={selectedWeek} />
    </div>
  );
}

/* ─────────────────────────── Table ─────────────────────────── */

const Table = ({ currentDate }: { currentDate: Date }) => {
  const [weekData, setWeekData] = useState<WeekData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── helpers ── */

  const getWeekDates = (date: Date) => {
    const start = moment(date).startOf("week");
    return Array.from({ length: 7 }, (_, i) => start.clone().add(i, "days"));
  };

  const hasTimePassed = (timeString: string, targetDate: moment.Moment) => {
    if (!targetDate.isSame(moment(), "day")) return true;
    const [timePart, period] = timeString.split(" ");
    const [h, m] = timePart.split(":").map(Number);
    let hour24 = h;
    if (period === "PM" && h !== 12) hour24 = h + 12;
    else if (period === "AM" && h === 12) hour24 = 0;
    const scheduled = moment().hour(hour24).minute(m).second(0);
    return moment().isAfter(scheduled.clone().add(1, "minutes"));
  };

  const jodiColor = (jodi: string) => {
    if (!jodi) return "black";
    const last2 = jodi.padStart(2, "0").slice(-2);
    return redColour.includes(last2) ? "red" : "black";
  };

  /* ── data loading ── */

  const generateWeekData = (data: any[], date: Date): WeekData => {
    const weekDates = getWeekDates(date);
    const result: WeekData = {};

    times.forEach((t) => {
      result[t] = {};
      daysOfWeek.forEach((d) => (result[t][d] = ""));
    });

    times.forEach((t) => {
      weekDates.forEach((wDate, idx) => {
        const dayName = daysOfWeek[idx];
        const dayData = data.find((item) =>
          moment(item.date, "DD-MM-YYYY").isSame(wDate, "day")
        );
        if (dayData?.items) {
          const found = dayData.items.find((item: any) => item.time === t);
          if (found?.number) result[t][dayName] = found.number;
        }
      });
    });

    return result;
  };

  const loadData = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const weekDates = getWeekDates(date);
      const monthsMap = new Map<string, { month: number; year: number }>();
      weekDates.forEach((d) => {
        const key = `${d.year()}-${d.month() + 1}`;
        monthsMap.set(key, { month: d.month() + 1, year: d.year() });
      });

      let allData: any[] = [];
      for (const { month, year } of Array.from(monthsMap.values())) {
        allData = [...allData, ...(await getAllRowsByMonthYear(month, year))];
      }

      const grouped = allData.reduce((acc: Record<string, any>, item: any) => {
        const d = new Date(item.date);
        const key = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
        if (!acc[key]) acc[key] = { date: key, items: [] };
        acc[key].items.push(item);
        return acc;
      }, {});

      setWeekData(generateWeekData(Object.values(grouped), date));
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  /* ── render ── */

  const weekDates = getWeekDates(currentDate);

  const renderRows = () =>
    timePairs.map(([t1, t2], pairIdx) => {
      // Pre-compute per-day values for this pair
      const dayValues = daysOfWeek.map((day, dIdx) => {
        const dayDate = weekDates[dIdx];
        const rawTop    = weekData[t1]?.[day] ?? "";
        const rawBottom = weekData[t2]?.[day] ?? "";
        const topDigit    = hasTimePassed(t1, dayDate) ? rawTop    : "";
        const bottomDigit = hasTimePassed(t2, dayDate) ? rawBottom : "";

        // Jodi = concat of both single digits (new format)
        // Backward compat: if top is already 2 digits and bottom is empty → use top as jodi
        let jodi = "";
        if (topDigit.length === 2 && !rawBottom) {
          jodi = topDigit;
        } else if (topDigit && bottomDigit) {
          jodi = topDigit + bottomDigit;
        }

        return { topDigit, bottomDigit, jodi };
      });

      return (
        <React.Fragment key={pairIdx}>
          {/* ── top time row ── */}
          <tr className="border-t-2 border-red-400">
            {/* time label */}
            <td className="px-1 sm:px-2 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold border border-red-400 text-left whitespace-nowrap bg-yellow-50 w-[72px] sm:w-[88px]">
              {t1}
            </td>

            {dayValues.map(({ topDigit, jodi }, dIdx) => {
              const color = jodiColor(jodi);
              return (
                <React.Fragment key={daysOfWeek[dIdx]}>
                  {/* single digit – top */}
                  <td className="border border-red-400 text-center py-1 sm:py-2 w-7 sm:w-9">
                    <span className="font-bold text-sm sm:text-base text-black">
                      {topDigit}
                    </span>
                  </td>

                  {/* jodi – rowspan=2, vertically centred */}
                  <td
                    rowSpan={2}
                    className="border border-red-400 text-center align-middle w-9 sm:w-12 bg-yellow-100"
                    style={{ verticalAlign: "middle" }}
                  >
                    {jodi && (
                      <span
                        className="font-extrabold text-base sm:text-xl leading-none"
                        style={{ color }}
                      >
                        {jodi}
                      </span>
                    )}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>

          {/* ── bottom time row ── */}
          <tr className="border-b-2 border-red-400">
            {/* time label */}
            <td className="px-1 sm:px-2 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold border border-red-400 text-left whitespace-nowrap bg-yellow-50">
              {t2}
            </td>

            {dayValues.map(({ bottomDigit }, dIdx) => (
              // Only digit cell — jodi column covered by rowspan above
              <td
                key={daysOfWeek[dIdx]}
                className="border border-red-400 text-center py-1 sm:py-2 w-7 sm:w-9"
              >
                <span className="font-bold text-sm sm:text-base text-black">
                  {bottomDigit}
                </span>
              </td>
            ))}
          </tr>
        </React.Fragment>
      );
    });

  if (loading) return <div className="text-center p-6 text-gray-600">Loading data…</div>;
  if (error)   return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="w-full overflow-x-auto rounded shadow-sm">
      <table
        className="border-2 border-red-500 bg-yellow-50 text-sm"
        style={{ borderCollapse: "collapse", minWidth: "600px" }}
      >
        <thead>
          <tr className="bg-yellow-200">
            <th className="px-1 sm:px-3 py-2 text-left text-xs sm:text-sm font-bold text-gray-800 border-2 border-red-500 whitespace-nowrap">
              Time
            </th>
            {daysOfWeek.map((day) => (
              <th
                key={day}
                colSpan={2}
                className="px-1 sm:px-3 py-2 text-center text-xs sm:text-sm font-bold text-gray-800 border-2 border-red-500"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

const MemoizedTable = React.memo(Table);
