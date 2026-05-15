"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import ResultTable from "@/components/ResultTabled";
import moment from "moment";
import {
  createLuckyNumber,
  deleteLuckyNumber,
  getLuckyNumbers,
} from "@/app/actions/action";
import { times } from "@/lib/times";


interface LuckyNumberProps {
  number: string;
  id: number;
  date: string;
  time: string;
  userId: number;
}
const AddResult = () => {
  const { data: session } = useSession();
  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumberProps[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  ); // Default to today
  const filteredLuckyNumbers = luckyNumbers.filter(
    (item) => moment(item.date).format("YYYY-MM-DD") === selectedDate
  );
  // const isDisabledAddBtn = moment(selectedDate).isSameOrAfter(moment(), "day");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numberInput, setNumberInput] = useState(""); // Single input for numbers
  const [timeInput, setTimeInput] = useState(""); // Input for selected time
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state initialized to null

  const fetchLuckyNumbers = useCallback(async () => {
    try {
      const response = await getLuckyNumbers({});
      setLuckyNumbers(response);
    } catch (error) {
      console.error("Error fetching lucky numbers:", error);
    }
  }, []);

  useEffect(() => {
    fetchLuckyNumbers(); // Fetch and initialize on mount
  }, [fetchLuckyNumbers]);

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numeric input and restrict to a maximum of 2 digits
    if (/^\d{0,2}$/.test(value)) {
      setNumberInput(value);
      setError(null); // Clear error if input is valid
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeInput(e.target.value);
    setError(null); // Clear error if input is valid
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numberInput.length !== 2) {
      setError("Please enter exactly 2 digits.");
      return;
    }
    if (!timeInput) {
      setError("Please select a time.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (session && session?.user && session?.user?.id) {
        //console.log("selectedDate", selectedDate);
        await createLuckyNumber({
          userId: Number(session?.user?.id?.toString()),
          number: numberInput,
          date: selectedDate,
          time: timeInput,
        });
        //console.log("Lucky number created:", result);
        // Reset form

        setNumberInput("");
        setTimeInput("");
        setError("");
        setIsModalOpen(false);

        await fetchLuckyNumbers();
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Failed to create lucky number.");
      console.error(err);
    } finally {
    }
  };
  const onHandleDelete = async (id: number) => {
    try {
      const response = await deleteLuckyNumber(id);
      if (response) {
        // console.log("Lucky number deleted successfully", response);
        await fetchLuckyNumbers();
      }
    } catch (error) {
      console.error("Error deleting lucky number:", error);
    }
  };
  const disabledTimes = filteredLuckyNumbers.map((item) => item.time);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); // Clear error when closing modal
    setNumberInput(""); // Reset number input
    setTimeInput(""); // Reset time input
    setIsSubmitting(false); // Reset submitting state
  };
  return (
    <div className="w-full h-full flex flex-col gap-5  2xl:container mx-auto">
      <div className="flex flex-col gap-2 justify-items-start items-start">
        <h1>Add Results Numbers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
        >
          Add Results
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          {isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-4">
                <svg
                  className="animate-spin h-10 w-10 text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <p className="text-yellow-500 text-lg font-medium">
                  Creating...
                </p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Add New Item
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={async (e) => {
                await handleSubmit(e);
                setIsModalOpen(false); // Close modal after successful submission
              }}
            >
              {/* Number Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Number (2 digits only)
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-indigo-300 ${error && numberInput.length !== 2 ? "border-red-500" : ""
                    }`}
                  placeholder="Enter a 2-digit number"
                  value={numberInput}
                  onChange={handleNumberInputChange}
                />
              </div>

              {/* Time Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Select Time
                </label>
                <select
                  value={timeInput}
                  onChange={handleTimeChange}
                  className="w-full px-3 py-2 border rounded shadow-sm cursor-pointer max-h-40 overflow-y-auto"
                  size={8}
                >
                  <option value="" disabled className="cursor-pointer">
                    -- Select a time --
                  </option>
                  {times.map((time, index) => (
                    <option
                      key={index}
                      value={time}
                      className="cursor-pointer"
                      disabled={disabledTimes.includes(time)}
                    >
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  numberInput.length !== 2 || !timeInput || isSubmitting
                }
                className={`w-full py-2 px-4 bg-gray-800 text-yellow-500 rounded-lg ${numberInput.length !== 2 || !timeInput || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex">
        <input
          style={{
            transform: "scale(1.1)",
            transformOrigin: "left",
            cursor: "pointer",
          }}
          type="date"
          className="px-2 py-2 bg-transparent border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-[0_0_20px_0_rgba(0,0,0,0.4)]"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <ResultTable
        data={filteredLuckyNumbers}
        columns={[
          { key: "number", label: "Number" },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
        ]}
        onDelete={onHandleDelete}
      />
    </div>
  );
};
export default AddResult;
