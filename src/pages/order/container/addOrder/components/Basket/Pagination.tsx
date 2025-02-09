import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  allParams: { [key: string]: string };
  setSearchParams: (params: { [key: string]: string }) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  allParams,
  setSearchParams,
}) => {
  // Initialize currentPage based on the URL or fallback to 1
  const [currentPage, setCurrentPage] = useState<number>(parseInt(allParams.page || "1"));
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage);
    setSearchParams({
      ...allParams,
      page: newPage.toString(),
      limit: itemsPerPage.toString(),
    });
  };

  useEffect(() => {
    setSearchParams({
      ...allParams,
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    });
  }, [currentPage]);

  return (
    <div className="pagination flex items-center justify-center space-x-3 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="pagination-btn p-1 bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
      >
        <ArrowBackIosNewIcon/>
      </button>

      <span className="text-lg">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="pagination-btn p-1 bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
      >
        <ArrowForwardIosIcon/>
      </button>
    </div>
  );
};

export default PaginationComponent;
