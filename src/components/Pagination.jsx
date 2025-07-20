import React from "react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  startIndex, 
  endIndex, 
  totalItems 
}) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} vehicles
      </div>
    </>
  );
};

export default Pagination;
