import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import { Hint } from 'react-autocomplete-hint';
import SearchResults from './SearchResults';
import { useNavigate } from 'react-router-dom';

const Search = () => {

    const [queryText, setQueryText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [firstProductNameArray, setFirstProductNameArray] = useState([]);

    const handleChange = (e) => setQueryText(e.target.value);

    useEffect(() => {
        if (!queryText) {
            setSearchResults([]);
        } else {
            (async () => {
                const url = 'http://localhost:4000/v4/product/search';
                // const url = 'http://localhost:8080/search';

                try {
                    const response = await axios.get(url, {
                        params: {
                            name: queryText,
                        }
                    });

                    setSearchResults(response.data);

                    if (response.data.length > 0) {
                        const firstProductName = response.data[0].name;
                        console.log(response.data[0]._id)
                        setFirstProductNameArray([firstProductName]);
                    }
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            })();
        }
    }, [queryText]);

    const navigate = useNavigate()

    const handleResultClick = (productId) => {
        setQueryText(''); // Reset giá trị input
        setSearchResults([]); // Xóa kết quả tìm kiếm
        // Chuyển đến trang ProductDetail với ID sản phẩm được chọn
        navigate(`/product/${productId}`);
    };

    const handleClearClick = () => {
        setQueryText(''); // Xóa nội dung ô input
        setSearchResults([]); // Xóa kết quả tìm kiếm
    };

    return (
        <div style={{
            flexDirection: 'column', // Hiển thị các phần tử thẳng hàng
            width: '600px'
        }}
            className="flex flex-col rounded-lg overflow-hidden shadow-lg max-w-600px w-90 mt-1rem mx-auto">

            {queryText && (
                <div className="max-h-75vh p-0 overflow-y-auto absolute top-[90px] z-5 bg-rose-200 rounded-lg">
                    <div className="px-4 ">
                        <ul className="border-t-1 border-gray-300 pt-2 pb-4 ">
                            <SearchResults searchResults={searchResults} handleResultClick={handleResultClick} />
                        </ul>
                    </div>
                </div>
            )}

            <div className="relative">
                <Hint options={firstProductNameArray}>
                    <input
                        className="appearance-none border-2 px-10 h-[68px] border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
                        id="username"
                        type=""
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        placeholder="Search..."
                        value={queryText}
                        onChange={handleChange}
                    />
                </Hint>
                <div className="absolute right-0 inset-y-0 flex items-center" onClick={handleClearClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>


                </div>

            </div>
        </div>

    )
}

export default Search