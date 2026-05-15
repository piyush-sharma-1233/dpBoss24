/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import React, { useState, useEffect } from "react";

const TableComponent: React.FC<{
  data: any;
  rollingComplete?: boolean;
  currentResultTime?: string;
}> = ({ data, rollingComplete = true, currentResultTime = "" }) => {
  // State to trigger re-render every 30 seconds for auto-updating results
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Update every 30 seconds to check if any time has passed
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const redColour = [
    "00", "50", "05", "55",
    "11", "61", "16", "66",
    "22", "72", "27", "77",
    "33", "83", "38", "88",
    "44", "94", "49", "99"
  ];

  const getNumberColor = (resultNumber: string) => {
    if (!resultNumber) return 'black';

    // Pad with leading zero if needed (e.g., "7" -> "07")
    const paddedNumber = resultNumber.padStart(2, '0');

    // Check if the last two digits are in the redColour array
    const lastTwoDigits = paddedNumber.slice(-2);

    return redColour.includes(lastTwoDigits) ? 'red' : 'black';
  };

  const sumOfDigits = (number: number) => {
    let sum = 0;
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    return sum;
  };

  // Helper function to check if time has passed with 1-minute delay
  const hasTimePassedWithDelay = (timeStr: string) => {
    return moment().isAfter(moment(timeStr, "hh:mm A").add(1, 'minutes'));
  };

  // Helper function to determine if result should be shown
  const shouldShowResult = (timeStr: string, resultNumber: string) => {
    if (!resultNumber) return false;

    // If this is the currently rolling result
    if (timeStr === currentResultTime) {
      return rollingComplete; // Only show if rolling is complete
    }

    // For past results, use existing delay logic
    return hasTimePassedWithDelay(timeStr);
  };

  // Hardcoded result values based on time
  const result1 = data.filter((item: any) => item.time === "10:00 AM");
  const result1Number = result1.length > 0 ? result1[0].number : "";
  const num = result1Number;
  const final = num ? String(sumOfDigits(num)).slice(-1) : "";

  const result2 = data.filter((item: any) => item.time === "10:30 AM");
  const result2Number = result2.length > 0 ? result2[0].number : "";
  const final2 = result2Number
    ? String(sumOfDigits(result2Number)).slice(-1)
    : "";
  const result3 = data.filter((item: any) => item.time === "11:00 AM");
  const result3Number = result3.length > 0 ? result3[0].number : "";
  const final3 = result3Number
    ? String(sumOfDigits(result3Number)).slice(-1)
    : "";

  const result4 = data.filter((item: any) => item.time === "11:30 AM");
  const result4Number = result4.length > 0 ? result4[0].number : "";
  const final4 = result4Number
    ? String(sumOfDigits(result4Number)).slice(-1)
    : "";

  const result5 = data.filter((item: any) => item.time === "12:00 PM");
  const result5Number = result5.length > 0 ? result5[0].number : "";
  const final5 = result5Number
    ? String(sumOfDigits(result5Number)).slice(-1)
    : "";
  const result6 = data.filter((item: any) => item.time === "12:30 PM");
  const result6Number = result6.length > 0 ? result6[0].number : "";
  const final6 = result6Number
    ? String(sumOfDigits(result6Number)).slice(-1)
    : "";
  const result7 = data.filter((item: any) => item.time === "01:00 PM");
  const result7Number = result7.length > 0 ? result7[0].number : "";
  const final7 = result7Number
    ? String(sumOfDigits(result7Number)).slice(-1)
    : "";

  const result8 = data.filter((item: any) => item.time === "01:30 PM");
  const result8Number = result8.length > 0 ? result8[0].number : "";
  const final8 = result8Number
    ? String(sumOfDigits(result8Number)).slice(-1)
    : "";
  const result9 = data.filter((item: any) => item.time === "02:00 PM");
  const result9Number = result9.length > 0 ? result9[0].number : "";
  const final9 = result9Number
    ? String(sumOfDigits(result9Number)).slice(-1)
    : "";
  const result10 = data.filter((item: any) => item.time === "02:30 PM");
  const result10Number = result10.length > 0 ? result10[0].number : "";
  const final10 = result10Number
    ? String(sumOfDigits(result10Number)).slice(-1)
    : "";
  const result11 = data.filter((item: any) => item.time === "03:00 PM");
  const result11Number = result11.length > 0 ? result11[0].number : "";
  const final11 = result11Number
    ? String(sumOfDigits(result11Number)).slice(-1)
    : "";

  const result12 = data.filter((item: any) => item.time === "03:30 PM");
  const result12Number = result12.length > 0 ? result12[0].number : "";
  const final12 = result12Number
    ? String(sumOfDigits(result12Number)).slice(-1)
    : "";

  const result13 = data.filter((item: any) => item.time === "04:00 PM");
  const result13Number = result13.length > 0 ? result13[0].number : "";
  const final13 = result13Number
    ? String(sumOfDigits(result13Number)).slice(-1)
    : "";

  const result14 = data.filter((item: any) => item.time === "04:30 PM");
  const result14Number = result14.length > 0 ? result14[0].number : "";
  const final14 = result14Number
    ? String(sumOfDigits(result14Number)).slice(-1)
    : "";

  const result15 = data.filter((item: any) => item.time === "05:00 PM");
  const result15Number = result15.length > 0 ? result15[0].number : "";
  const final15 = result15Number
    ? String(sumOfDigits(result15Number)).slice(-1)
    : "";

  const result16 = data.filter((item: any) => item.time === "05:30 PM");
  const result16Number = result16.length > 0 ? result16[0].number : "";
  const final16 = result16Number
    ? String(sumOfDigits(result16Number)).slice(-1)
    : "";

  const result17 = data.filter((item: any) => item.time === "06:00 PM");
  const result17Number = result17.length > 0 ? result17[0].number : "";
  const final17 = result17Number
    ? String(sumOfDigits(result17Number)).slice(-1)
    : "";

  const result18 = data.filter((item: any) => item.time === "06:30 PM");
  const result18Number = result18.length > 0 ? result18[0].number : "";
  const final18 = result18Number
    ? String(sumOfDigits(result18Number)).slice(-1)
    : "";

  const result19 = data.filter((item: any) => item.time === "07:00 PM");
  const result19Number = result19.length > 0 ? result19[0].number : "";
  const final19 = result19Number
    ? String(sumOfDigits(result19Number)).slice(-1)
    : "";

  const result20 = data.filter((item: any) => item.time === "07:30 PM");
  const result20Number = result20.length > 0 ? result20[0].number : "";
  const final20 = result20Number
    ? String(sumOfDigits(result20Number)).slice(-1)
    : "";

  const result21 = data.filter((item: any) => item.time === "08:00 PM");
  const result21Number = result21.length > 0 ? result21[0].number : "";
  const final21 = result21Number
    ? String(sumOfDigits(result21Number)).slice(-1)
    : "";

  const result22 = data.filter((item: any) => item.time === "08:30 PM");
  const result22Number = result22.length > 0 ? result22[0].number : "";
  const final22 = result22Number
    ? String(sumOfDigits(result22Number)).slice(-1)
    : "";

  const result23 = data.filter((item: any) => item.time === "09:00 PM");
  const result23Number = result23.length > 0 ? result23[0].number : "";
  const final23 = result23Number
    ? String(sumOfDigits(result23Number)).slice(-1)
    : "";
  const result24 = data.filter((item: any) => item.time === "09:30 PM");
  const result24Number = result24.length > 0 ? result24[0].number : "";
  const final24 = result24Number
    ? String(sumOfDigits(result24Number)).slice(-1)
    : "";
  return (
    <table className="w-full min-w-4xl text-[15px]  font-semibold font-sans italic center border border-red-500">
      <thead>
        <tr className="bg-white text-[#e91e63]  font-semibold ">
          <th
            scope="col"
            className="p-[2px] border text-[#e91e63] border-red-500"
          >
            Round1
          </th>
          <th
            scope="col"
            className="p-[2px] border text-[#e91e63] border-red-500"
          >
            Result1
          </th>
          <th
            scope="col"
            className="p-[2px] border text-[#e91e63] border-red-500"
          >
            Round2
          </th>
          <th
            scope="col"
            className="p-[2px] border text-[#e91e63] border-red-500"
          >
            Result2
          </th>
        </tr>
      </thead>
      <tbody className="bg-yellow-100 text-[15px] font-semibold font-sans italic">
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">10:00 AM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("10:00 AM", num) ? getNumberColor(String(num)) : 'black' }}>
            {shouldShowResult("10:00 AM", num) ? `${num} - ${final}` : "--"}
          </td>
          <td className="border border-red-500 text-center">10:30 AM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("10:30 AM", result2Number) ? getNumberColor(String(result2Number)) : 'black' }}>
            {shouldShowResult("10:30 AM", result2Number) ? `${result2Number} - ${final2}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">11:00 AM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("11:00 AM", result3Number) ? getNumberColor(String(result3Number)) : 'black' }}>
            {shouldShowResult("11:00 AM", result3Number) ? `${result3Number} - ${final3}` : "--"}
          </td>
          <td className="border border-red-500 text-center">11:30 AM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("11:30 AM", result4Number) ? getNumberColor(String(result4Number)) : 'black' }}>
            {shouldShowResult("11:30 AM", result4Number) ? `${result4Number} - ${final4}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">12:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("12:00 PM", result5Number) ? getNumberColor(String(result5Number)) : 'black' }}>
            {shouldShowResult("12:00 PM", result5Number) ? `${result5Number} - ${final5}` : "--"}
          </td>
          <td className="border border-red-500 text-center">12:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("12:30 PM", result6Number) ? getNumberColor(String(result6Number)) : 'black' }}>
            {shouldShowResult("12:30 PM", result6Number) ? `${result6Number} - ${final6}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">01:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("01:00 PM", result7Number) ? getNumberColor(String(result7Number)) : 'black' }}>
            {shouldShowResult("01:00 PM", result7Number) ? `${result7Number} - ${final7}` : "--"}
          </td>
          <td className="border border-red-500 text-center">01:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("01:30 PM", result8Number) ? getNumberColor(String(result8Number)) : 'black' }}>
            {shouldShowResult("01:30 PM", result8Number) ? `${result8Number} - ${final8}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">02:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("02:00 PM", result9Number) ? getNumberColor(String(result9Number)) : 'black' }}>
            {shouldShowResult("02:00 PM", result9Number) ? `${result9Number} - ${final9}` : "--"}
          </td>
          <td className="border border-red-500 text-center">02:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("02:30 PM", result10Number) ? getNumberColor(String(result10Number)) : 'black' }}>
            {shouldShowResult("02:30 PM", result10Number) ? `${result10Number} - ${final10}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">03:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("03:00 PM", result11Number) ? getNumberColor(String(result11Number)) : 'black' }}>
            {shouldShowResult("03:00 PM", result11Number) ? `${result11Number} - ${final11}` : "--"}
          </td>
          <td className="border border-red-500 text-center">03:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("03:30 PM", result12Number) ? getNumberColor(String(result12Number)) : 'black' }}>
            {shouldShowResult("03:30 PM", result12Number) ? `${result12Number} - ${final12}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">04:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("04:00 PM", result13Number) ? getNumberColor(String(result13Number)) : 'black' }}>
            {shouldShowResult("04:00 PM", result13Number) ? `${result13Number} - ${final13}` : "--"}
          </td>
          <td className="border border-red-500 text-center">04:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("04:30 PM", result14Number) ? getNumberColor(String(result14Number)) : 'black' }}>
            {shouldShowResult("04:30 PM", result14Number) ? `${result14Number} - ${final14}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">05:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("05:00 PM", result15Number) ? getNumberColor(String(result15Number)) : 'black' }}>
            {shouldShowResult("05:00 PM", result15Number) ? `${result15Number} - ${final15}` : "--"}
          </td>
          <td className="border border-red-500 text-center">05:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("05:30 PM", result16Number) ? getNumberColor(String(result16Number)) : 'black' }}>
            {shouldShowResult("05:30 PM", result16Number) ? `${result16Number} - ${final16}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">06:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("06:00 PM", result17Number) ? getNumberColor(String(result17Number)) : 'black' }}>
            {shouldShowResult("06:00 PM", result17Number) ? `${result17Number} - ${final17}` : "--"}
          </td>
          <td className="border border-red-500 text-center">06:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("06:30 PM", result18Number) ? getNumberColor(String(result18Number)) : 'black' }}>
            {shouldShowResult("06:30 PM", result18Number) ? `${result18Number} - ${final18}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">07:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("07:00 PM", result19Number) ? getNumberColor(String(result19Number)) : 'black' }}>
            {shouldShowResult("07:00 PM", result19Number) ? `${result19Number} - ${final19}` : "--"}
          </td>
          <td className="border border-red-500 text-center">07:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("07:30 PM", result20Number) ? getNumberColor(String(result20Number)) : 'black' }}>
            {shouldShowResult("07:30 PM", result20Number) ? `${result20Number} - ${final20}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">08:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("08:00 PM", result21Number) ? getNumberColor(String(result21Number)) : 'black' }}>
            {shouldShowResult("08:00 PM", result21Number) ? `${result21Number} - ${final21}` : "--"}
          </td>
          <td className="border border-red-500 text-center">08:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("08:30 PM", result22Number) ? getNumberColor(String(result22Number)) : 'black' }}>
            {shouldShowResult("08:30 PM", result22Number) ? `${result22Number} - ${final22}` : "--"}
          </td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">09:00 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("09:00 PM", result23Number) ? getNumberColor(String(result23Number)) : 'black' }}>
            {shouldShowResult("09:00 PM", result23Number) ? `${result23Number} - ${final23}` : "--"}
          </td>
          <td className="border border-red-500 text-center">09:30 PM</td>
          <td className="border border-red-500 text-center" style={{ color: shouldShowResult("09:30 PM", result24Number) ? getNumberColor(String(result24Number)) : 'black' }}>
            {shouldShowResult("09:30 PM", result24Number) ? `${result24Number} - ${final24}` : "--"}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;
