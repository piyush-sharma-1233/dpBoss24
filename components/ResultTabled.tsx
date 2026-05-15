/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import moment from "moment";
import React from "react";

interface ResultTableProps {
  data: Array<any>;
  columns: Array<{ key: string; label: string }>;
  onDelete: (id: number) => void;
}

const ResultTable: React.FC<ResultTableProps> = ({
  data,
  columns,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto shadow-[0_0_20px_0_rgba(0,0,0,0.4)]">
      <table className="min-w-full table-auto border border-red-500">
        <thead>
          <tr className="bg-yellow-200 font-semibold font-sans text-[15px]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700"
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className=" font-semibold font-sans text-[15px] border border-red-500">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-red-500 hover:bg-yellow-100 hover:cursor-pointer"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-2 text-sm text-gray-900"
                  >
                    {column.key === "date"
                      ? moment(row[column.key]).format("YYYY-MM-DD")
                      : row[column.key]}
                  </td>
                ))}
                <td className="px-4 py-2 border-b border-red-500">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-red-500">
              <td colSpan={columns.length + 1} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
