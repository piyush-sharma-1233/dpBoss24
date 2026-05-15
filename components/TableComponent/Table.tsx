/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  data: Array<any>;
  columns: Array<Column>;
  rowsPerPage?: number;
  onEdit?: (index: number, item: any) => void;
  onDelete?: (index: number, item: any) => void;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  rowsPerPage = 5,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data based on search query
  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.key]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 w-fit">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-indigo-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 when filtering
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="min-w-full bg-white border rounded shadow-md "
          style={{ tableLayout: "fixed" }} // Set table-layout to fixed
        >
          <thead>
            <tr className="bg-gray-200 text-left">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-2 border">
                  {column.label.toUpperCase()}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-2 border">ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-2 border">
                      {item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-2 border">
                      {onEdit && (
                        <button
                          className="mr-2 px-2 py-1 text-white bg-blue-500 rounded"
                          onClick={() => onEdit(index, item)}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="px-2 py-1 text-white bg-red-500 rounded"
                          onClick={() => onDelete(index, item)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
