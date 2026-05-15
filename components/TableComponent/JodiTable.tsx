/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import React from "react";

const JodiTable: React.FC<{ data: any }> = ({ data }) => {
  // Hardcoded result values based on time
  const sumOfDigits = (number: number) => {
    let sum = 0;
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    return sum;
  };

  // Helper function to check if time has passed with 15-minute delay
  const hasTimePassedWithDelay = (timeStr: string) => {
    return moment().isAfter(moment(timeStr, "hh:mm A").add(15, 'minutes'));
  };

  // Hardcoded result values based on time
  const result1 = data.filter((item: any) => item.time === "10:15 AM");
  const result1Number = result1.length > 0 ? result1[0].number : "";
  const num = result1Number;
  const final = num && hasTimePassedWithDelay("10:15 AM") ? String(sumOfDigits(num)).slice(-1) : "-";

  const result2 = data.filter((item: any) => item.time === "11:15 AM");
  const result2Number = result2.length > 0 ? result2[0].number : "";
  const final2 = result2Number && hasTimePassedWithDelay("11:15 AM")
    ? String(sumOfDigits(result2Number)).slice(-1)
    : "-";
  const result3 = data.filter((item: any) => item.time === "12:15 PM");
  const result3Number = result3.length > 0 ? result3[0].number : "";
  const final3 = result3Number && hasTimePassedWithDelay("12:15 PM")
    ? String(sumOfDigits(result3Number)).slice(-1)
    : "-";

  const result4 = data.filter((item: any) => item.time === "01:15 PM");
  const result4Number = result4.length > 0 ? result4[0].number : "";
  const final4 = result4Number && hasTimePassedWithDelay("01:15 PM")
    ? String(sumOfDigits(result4Number)).slice(-1)
    : "-";
  const result5 = data.filter((item: any) => item.time === "02:15 PM");
  const result5Number = result5.length > 0 ? result5[0].number : "";
  const final5 = result5Number && hasTimePassedWithDelay("02:15 PM")
    ? String(sumOfDigits(result5Number)).slice(-1)
    : "-";
  const result6 = data.filter((item: any) => item.time === "03:15 PM");
  const result6Number = result6.length > 0 ? result6[0].number : "";
  const final6 = result6Number && hasTimePassedWithDelay("03:15 PM")
    ? String(sumOfDigits(result6Number)).slice(-1)
    : "-";
  const result7 = data.filter((item: any) => item.time === "04:15 PM");
  const result7Number = result7.length > 0 ? result7[0].number : "";
  const final7 = result7Number && hasTimePassedWithDelay("04:15 PM")
    ? String(sumOfDigits(result7Number)).slice(-1)
    : "-";

  const result8 = data.filter((item: any) => item.time === "05:15 PM");
  const result8Number = result8.length > 0 ? result8[0].number : "";
  const final8 = result8Number && hasTimePassedWithDelay("05:15 PM")
    ? String(sumOfDigits(result8Number)).slice(-1)
    : "-";
  const result9 = data.filter((item: any) => item.time === "06:15 PM");
  const result9Number = result9.length > 0 ? result9[0].number : "";
  const final9 = result9Number && hasTimePassedWithDelay("06:15 PM")
    ? String(sumOfDigits(result9Number)).slice(-1)
    : "-";
  const result10 = data.filter((item: any) => item.time === "07:15 PM");
  const result10Number = result10.length > 0 ? result10[0].number : "";
  const final10 = result10Number && hasTimePassedWithDelay("07:15 PM")
    ? String(sumOfDigits(result10Number)).slice(-1)
    : "-";
  const result11 = data.filter((item: any) => item.time === "08:15 PM");
  const result11Number = result11.length > 0 ? result11[0].number : "";
  const final11 = result11Number && hasTimePassedWithDelay("08:15 PM")
    ? String(sumOfDigits(result11Number)).slice(-1)
    : "-";

  const result12 = data.filter((item: any) => item.time === "09:15 PM");
  const result12Number = result12.length > 0 ? result12[0].number : "";
  const final12 = result12Number && hasTimePassedWithDelay("09:15 PM")
    ? String(sumOfDigits(result12Number)).slice(-1)
    : "-";

  return (
    <table className="w-[49%] table-fixed text-center border border-red-500 shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
      <thead>
        <tr className="bg-yellow-200 text-[15px] font-semibold font-sans italic">
          <th scope="col" className="p-[2px] border border-red-500">
            Time
          </th>
          <th scope="col" className="p-[2px] border border-red-500">
            Result
          </th>
        </tr>
      </thead>
      <tbody className="bg-yellow-100 text-[15px] font-semibold font-sans italic">
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`10:15 AM / 04:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final}${final7}`}</td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`11:15 AM / 05:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final2}${final8}`}</td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`12:15 PM / 06:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final3}${final9}`}</td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`01:15 PM / 07:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final4}${final10}`}</td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`02:15 PM / 08:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final5}${final11}`}</td>
        </tr>
        <tr className="border border-red-500">
          <td className="border border-red-500 text-center">{`03:15 PM / 09:15 PM`}</td>
          <td className="border border-red-500 text-center">{`${final6}${final12}`}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default JodiTable;
