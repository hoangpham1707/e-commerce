import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange, hasComments, number }) => {
    
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);

    // const url = queryParams.get('page') || 1;

    
    const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
    // console.log(typeof(pageNumbers));
    const renderPageNumbers = () => {
        if (totalPages <= 4) {
            // Display all page numbers without ellipsis
            return pageNumbers.map((item) => (
                <li >
                    
                    <Link to={`?page=${item}`}>
                    
                        <button
                            // className={`pagination-button ${currentPage === item ? 'active bg-green-500' : ''} hover:bg-green-500`}
                            onClick={() => handlePageClick(item)}
                            disabled={totalPages === 1}

                        >
                            <div className={` flex items-center justify-center px-4 h-10 leading-tight ${currentPage === item ? " text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 " : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700" }`}>

                                {item}
                            </div>
                        </button>
                    </Link>
                    
                </li>
            ));
        }

        // Display current page and 3 neighboring pages
        const visiblePages = [];
        if (currentPage <= 3) {
            visiblePages.push(...pageNumbers.slice(0, 4));
            visiblePages.push('ellipsis');
            visiblePages.push(...pageNumbers.slice(totalPages - 1));
        } else if (currentPage >= totalPages - 1) {
            visiblePages.push(...pageNumbers.slice(0, 1));
            visiblePages.push('ellipsis');
            visiblePages.push(...pageNumbers.slice(currentPage - 3));
        } else {
            visiblePages.push(...pageNumbers.slice(0, 1));
            visiblePages.push('ellipsis');
            visiblePages.push(...pageNumbers.slice(currentPage - 3, currentPage + 2));
            visiblePages.push('ellipsis');
            visiblePages.push(...pageNumbers.slice(totalPages - 1));
        }

        return visiblePages.map((item, index) => (
            <li key={index}>
                {item === 'ellipsis' ? (
                    <span className="ellipsis">...</span>
                ) : (
                    <Link to={`?page=${item}`}>
                    
                        <button
                            // className={`pagination-button ${currentPage === item ? 'active bg-green-500' : ''} hover:bg-green-500`}
                            onClick={() => handlePageClick(item)}
                        >
                            <div className={` flex items-center justify-center px-4 h-10 leading-tight ${currentPage === item ? " text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 " : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700" }`}>

                                {item}
                            </div>
                        </button>
                    </Link>
                )}
            </li>
        ));

    };

    const handlePageClick = (pageNumber) => {
        onPageChange(pageNumber);
        if (hasComments) {
            scrollToComment();
        }
    };

    const handlePreviousClick = () => {
        onPageChange(currentPage - 1);
        if (hasComments) {
            scrollToComment();
        }
    };

    const handleNextClick = () => {
        onPageChange(currentPage + 1);
        if (hasComments) {
            scrollToComment();
        }
    };

    const scrollToComment = () => {
        const commentSection = document.getElementById('comment');
        commentSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };
    // console.log(`${currentPage} + "đây là cuối trang"`)


    return (
        <div className="pagination">
            <ul className="flex space-x-2 justify-center">
                {totalPages <= 5 ? null : (
                    <Link to={`?page=${currentPage - 1}`}
                        className='flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                        <button
                            className="pagination-button"
                            onClick={handlePreviousClick}
                            disabled={currentPage === 1}
                        >
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
        </svg>
                        </button>
                    </Link>
                )}
                {renderPageNumbers()}
                {totalPages <= 5 ? null : (
                    <Link to={`?page=${currentPage + 1}`}
                        className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                        <button
                            className="pagination-button"
                            disabled={currentPage === totalPages}
                            onClick={handleNextClick}
                        >
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
                        </button>
                    </Link>
                )}
            </ul>
        </div>
    );
};

export default Pagination;