/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { getAllRowsByMonthYear } from "../actions/action";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { times, daysOfWeek } from "@/lib/times";

interface Segment {
  values: number[];
}

export interface Day {
  name: string;
  dateRange: string;
  segments: Segment[];
}

export interface TableData {
  days: Day[];
}

export default function Charts() {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const datePickerRef = useRef<DatePicker>(null);

  const handleWeekChange = (date: Date | null) => {
    if (date) {
      setSelectedWeek(date);
    }
  };

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const getWeekRange = (date: Date) => {
    const startOfWeek = moment(date).startOf('week');
    const endOfWeek = moment(date).endOf('week');
    return `${startOfWeek.format('DD-MM-YYYY')} to ${endOfWeek.format('DD-MM-YYYY')}`;
  };

  return (
    <div className="flex flex-col py-4 gap-4 px-4 w-full min-h-screen font-[family-name:var(--font-geist-sans)] bg-yellow-100 2xl:container mx-auto">
      <div className="flex justify-start">
        <div className="flex flex-col gap-2">
          {/* <label
            htmlFor="weekPicker"
            className="text-sm font-medium text-gray-700"
          >
            Select Week
          </label> */}
          <div className="flex items-center gap-2">
            <DatePicker
              id="weekPicker"
              showIcon
              icon={
                <span
                  onClick={handleIconClick}
                  className="text-gray-400 cursor-pointer"
                >
                  📅
                </span>
              }
              ref={datePickerRef}
              selected={selectedWeek}
              onChange={handleWeekChange}
              dateFormat="dd/MM/yyyy"
              className=" border w-44 text-center cursor-pointer bg-transparent border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
              placeholderText="Select Week"
            />
            <div className="text-base font-semibold text-red-600">
              Week: {getWeekRange(selectedWeek)}
            </div>
          </div>
        </div>
      </div>
      <MemoizedTable currentDate={selectedWeek} />
    </div>
  );
}

interface WeekData {
  [time: string]: { [day: string]: string };
}

const Table = ({ currentDate }: { currentDate: Date }) => {
  const [weekData, setWeekData] = useState<WeekData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redColour = [
    "00", "50", "05", "55",
    "11", "61", "16", "66",
    "22", "72", "27", "77",
    "33", "83", "38", "88",
    "44", "94", "49", "99"
  ];

  const sumOfDigits = (number: number) => {
    let sum = 0;
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    return sum;
  };

  const hasTimePassed = (timeString: string, targetDate: moment.Moment) => {
    // If the target date is not today, show all numbers
    if (!targetDate.isSame(moment(), 'day')) {
      return true;
    }

    // Parse the time string (e.g., "10:30 AM")
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }

    // Create a moment object for the scheduled time today
    const scheduledTime = moment().hour(hour24).minute(minutes).second(0);

    // Check if current time is after the scheduled time + 2 minutes delay
    const displayTime = scheduledTime.clone().add(1, 'minutes');
    return moment().isAfter(displayTime);
  };

  const getNumberColor = (cellValue: string) => {
    if (!cellValue) return 'black';

    // Extract the number part before the dash (e.g., "127-3" -> "127")
    const numberPart = cellValue.split('-')[0];

    // For single digit numbers, pad with leading zero (e.g., "7" -> "07")
    const paddedNumber = numberPart.padStart(2, '0');

    // Check if the last two digits are in the redColour array
    const lastTwoDigits = paddedNumber.slice(-2);

    return redColour.includes(lastTwoDigits) ? 'red' : 'black';
  };

  const getWeekDates = (selectedDate: Date) => {
    const startOfWeek = moment(selectedDate).startOf('week');
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(startOfWeek.clone().add(i, 'days'));
    }
    return weekDates;
  };

  const generateWeekData = (data: any[]) => {
    const weekDates = getWeekDates(currentDate);
    const weekData: WeekData = {};

    // Initialize all times and days
    times.forEach(time => {
      weekData[time] = {};
      daysOfWeek.forEach(day => {
        weekData[time][day] = '';
      });
    });

    // Fill in data for each time and day
    times.forEach(time => {
      weekDates.forEach((date, dayIndex) => {
        const dayName = daysOfWeek[dayIndex];

        // Find data for this specific date and time
        const dayData = data.find(item => {
          const itemDate = moment(item.date, 'DD-MM-YYYY');
          return itemDate.isSame(date, 'day');
        });

        if (dayData && dayData.items) {
          const timeItem = dayData.items.find((item: any) => item.time === time);
          if (timeItem && timeItem.number) {
            const num = timeItem.number;
            const final = String(sumOfDigits(num)).slice(-1);
            weekData[time][dayName] = `${num}-${final}`;
          }
        }
      });
    });

    return weekData;
  };

  const generateTable = () => {
    const weekDates = getWeekDates(currentDate);

    return times.map((time, i) => (
      <tr key={i}>
        <td className="font-semibold font-sans px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-base border border-red-500 text-left">
          <div className="text-xs md:text-base text-wrap text-black">{time}</div>
        </td>
        {daysOfWeek.map((day, dayIndex) => {
          const dayDate = weekDates[dayIndex];
          const shouldShowNumber = hasTimePassed(time, dayDate);
          const cellValue = weekData[time]?.[day] || '';
          const displayValue = shouldShowNumber ? cellValue : '';
          const textColor = getNumberColor(displayValue);

          return (
            <td
              key={day}
              className="font-semibold font-sans px-1 sm:px-2 py-1 sm:py-2 text-xs sm:text-base border border-red-500 text-center"
            >
              <div
                className="text-xs md:text-base text-wrap"
                style={{ color: textColor }}
              >
                {displayValue}
              </div>
            </td>
          );
        })}
      </tr>
    ));
  };

  const loadData = async (currentDate: Date) => {
    setLoading(true);
    setError(null);

    try {
      const weekDates = getWeekDates(currentDate);
      // const startDate = weekDates[0];
      // const endDate = weekDates[6];

      // Get data for all months that this week spans
      const monthsMap = new Map<string, { month: number; year: number }>();
      weekDates.forEach(date => {
        const key = `${date.year()}-${date.month() + 1}`;
        monthsMap.set(key, { month: date.month() + 1, year: date.year() });
      });

      let allData: any[] = [];
      for (const { month, year } of Array.from(monthsMap.values())) {
        const monthData = await getAllRowsByMonthYear(month, year);
        allData = [...allData, ...monthData];
      }

      const groupedByDate = allData.reduce(
        (acc: Record<string, any>, item: any) => {
          const d = new Date(item.date);
          const dateKey = `${d.getDate()}-${d.getMonth() + 1
            }-${d.getFullYear()}`;

          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, items: [] };
          }
          acc[dateKey].items.push(item);
          return acc;
        },
        {}
      );

      const groupedData = Object.values(groupedByDate);
      const weekData = generateWeekData(groupedData);
      setWeekData(weekData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentDate);
  }, [currentDate]);

  // const getWeekRange = () => {
  //   const weekDates = getWeekDates(currentDate);
  //   const startDate = weekDates[0];
  //   const endDate = weekDates[6];
  //   return `${startDate.format('DD|MM')} to ${endDate.format('DD|MM')}`;
  // };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center p-4">Loading data...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : (
        <div className="w-full">
          {/* Week Range Header */}
          {/* <div className="text-center mb-4">
            <div className="inline-block border-2 border-blue-500 px-4 py-2 bg-white">
              <span className="text-lg font-semibold">Date: {getWeekRange()}</span>
            </div>
          </div> */}

          <table className="table-fixed border border-red-500 w-full mx-auto">
            <thead>
              <tr className="bg-yellow-200 font-semibold font-sans text-sm sm:text-base border border-red-500">
                <th className="px-1 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-base font-medium text-gray-700 border border-red-500 w-16 sm:w-24">
                  Time
                </th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="px-1 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-base font-medium text-gray-700 border border-red-500"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-semibold font-sans text-xs sm:text-base border border-red-500">
              {generateTable()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MemoizedTable = React.memo(Table);
