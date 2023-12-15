import React from 'react'

const SearchResults = ({ searchResults, setQueryText, handleResultClick }) => {

    // const handleResultClick = (name) => {
    //     setQueryText(name); // Cập nhật giá trị trong input
    // };

    return (
        <div>
            {searchResults.length === 0 ? (
                <p className="p-2">No search results found.</p>
            ) : (
                searchResults.map(({ _id, name, numberOfReviews, rate }) => (
                    <div
                        style={{
                            gridTemplateColumns: '6fr',
                            gridColumnGap: '1rem',
                            // height: '70px',
                            overflow: 'hidden',
                            width: '545px',
                        }}
                        key={_id}
                        className="p-2 rounded-lg hover:bg-teal-500 hover:text-white cursor-pointer"
                        onClick={() => handleResultClick(_id)}
                    >
                        <div align='start'>
                            {/* <Link to={`/product_detail/${_id}`}> */}

                            <p>{name}</p>
                            {/* <p>{numberOfReviews}</p>
                            <p>{rate}</p> */}
                            {/* </Link> */}
                        </div>
                    </div>
                ))
            )}
        </div>

    )
}

export default SearchResults