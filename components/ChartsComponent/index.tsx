"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const ChartsComponent: React.FC<any> = ({ data }) => {
  return (
    <div className="w-full relative overflow-x-auto p-4">
      <h1 className="p-2 flex flex-row items-center justify-center bg-purle text-white font-bold text-2xl">
        Milan Night Matka Panel Chart
      </h1>
      <div></div>
      <table className="w-full border-separate border-spacing-0.5 text-center border border-primaryBlue">
        <thead>
          <tr className="w-full bg-yellow-200 text-black font-semibold">
            <th className="border border-primaryBlue">Date</th>
            <th className="border border-primaryBlue">Monday</th>
            <th className=" border border-primaryBlue">Tue</th>
            <th className=" border border-primaryBlue">Wed</th>
            <th className=" border border-primaryBlue">Thu</th>
            <th className="border border-primaryBlue ">Fri</th>
            <th className="border border-primaryBlue ">Sat</th>
          </tr>
        </thead>
        <tbody>
          {data.days.map((day: any, index: number) => (
            <tr key={index} className="bg-white text-black">
              <th className="w-full flex items-center justify-center font-medium text-white-500 border border-primaryBlue">
                <div className="w-1/12 flex justify-center">
                  {/* {day.dateRange} */}
                  qewqewqeqw
                </div>
              </th>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    {day.segments.map((segment: any, index: number) => (
                      <span key={index}>{segment.values}</span>
                    ))}
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex gap-1 flex-row justify-between">
                  <div className=" flex flex-col border-l border-y border-primaryBlue">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="w-full flex flex-row items-center justify-center border border-separate border-primaryBlue">
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                  </div>
                  <div className="w-2/6 flex flex-col border-r border-y border-primaryBlue">
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChartsComponent;
