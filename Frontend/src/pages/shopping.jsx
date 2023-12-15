import React from 'react'
import Hearder from '../components/header';
import Footer from '../components/footer';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useContext, useState, useReducer, useEffect } from 'react';
import { Store } from '../store';
import UserTest from '../components/sidebar';
import {AiFillCaretDown, AiFillStar,AiOutlineStar} from 'react-icons/ai';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Pagination from '../components/pagination';


const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, products: action.payload.products, pages: action.payload.pages, page: action.payload.page,countProducts: action.payload.countProducts, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

const Shopping = () => {
   
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(queryParams.get('page') || 1);
    
    // const [compare,setCompare] = useState("")


    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [rate, setRate] = useState("");
    
    const [sort, setSort] = useState("");

    

    
//   const [hilightPrice, setHilightPrice] = useState(price);
//   const [hilightRating, setHilightRating] = useState(rating);
//   const [hilightSort, setHilightSort] = useState(sort);

//   const [valuePrice, setValuePrice] = useState("");



//   console.log({category, price,rating,sort})
    // const queryParams = new URLSearchParams(location.search);
    // const {page : currentPage} = params;
    // const [currentPage, setCurrentPage] = useState(1);
    // const currentPage = queryParams.get('page') || 1;
    // const [totalPages, setTotalPages] = useState(1);
//   console.log(currentPage)
const [showCategory, setShowCategory] = useState(false);
const [showReview, setShowReview] = useState(false);
const [showPrice, setShowPrice] = useState(false);
const [show, setShow] = useState(false);
const [categories, setCategories] = useState([]);
const [{ loading, error, products, pages, page, countProducts }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
});
useEffect(() => {
    const fetchData = async () => {
    // const result = await axios.get('/api/products');
    // setProducts(result.data);
    dispatch({ type: 'FETCH_REQUEST' });
    try {

        const result = await axios.get(`/v4/product/getFilter?category=${category}&price=${price}&rate=${rate}&sort=${sort}&page=${currentPage}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: {pages : result.data.pages, products : result.data.products, page : result.data.page, countProducts:result.data.countProducts }});
        // setCurrentPage(1)
        // setTotalPages(result.data.pages)
        // console.log(result)
    } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
    }
    };
    fetchData();

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/v4/categories/getAllCategories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    fetchCategories();
}, [currentPage, category, price, rate, sort, countProducts]);
const handlePageChange = (newPage) => {
    localStorage.setItem('shoppingCurrentPage', newPage.toString());
    setCurrentPage(newPage);
    // console.log(newPage)
};

// console.log(localStorage.getItem('shoppingCurrentPage'));
// console.log(`${currentPage} + "đây là đầu trang"`)

// console.log(categories);

const handleFilterPrice = (e) => {
    const result = e.target.getAttribute('value');
    setPrice(result)
    // console.log(result);
}
// const handleFilterCategory = (e) => {
//     const result = e.target.getAttribute('value');
//     setPrice(result)
//     // console.log(result);
// }


const handleFilterSort = (e) => {
    const result = e.target.getAttribute('value');
    setSort(result)
    
    // console.log(result);
}

const handleFilterRate = (e) => {
    const result = e.currentTarget.getAttribute('value');
    setRate(result);
    // console.log()
    // console.log('day ne')
    // console.log(result);
}
  
//   const handleClick = (e) =>{
//     const result = e.target.value;
//     console.log(result)
//     // setPrice(result)
//   }

  return (
    
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        <Hearder/>
        <div className='w-5/6 mx-auto py-[50px] grid grid-cols-5 gap-x-[20px]'>

            <div className="col-span-1  rounded overflow-hidden ">
                <div className=''>
                    <div className='flex cursor-pointer items-center rounded-tl rounded-tr gap-x-[5px] bg-white p-[5px]'  onClick={() => setShowCategory(!showCategory)}>
                        {
                            showCategory ? (
                                <AiFillCaretDown />
                            ) : (
                                <AiFillCaretDown className='-rotate-90'/>
                            )
                        }
                        
                        <p className="text-2xl font-medium " >Thể loại</p>
                    </div>
                    {showCategory && (
                    <ul className=' flex items-center flex-col gap-y-[10px] p-[10px] bg-white'>
                        {
                            categories.map((item) => (
                                
                            <li onClick={() => {setCategory(encodeURIComponent(item.title)); console.log(item)}}  className={` text-xl cursor-pointer w-full rounded border flex justify-start p-[5px] ${ decodeURIComponent(category)=== item.title ? "bg-[#cbf1ff] shadow-lg" : "hover:bg-[#cbf1ff] hover:shadow-lg" }  `}>
                                {item.title}
                            </li>
                            ))
                        }
                        
                    </ul>
                    )}
                </div>
                <div className=''>
                    <div className='flex cursor-pointer items-center gap-x-[5px] bg-white p-[5px]' onClick={() => setShowReview(!showReview)}>
                        {
                            showReview ? (
                                <AiFillCaretDown />
                            ) : (
                                <AiFillCaretDown className='-rotate-90'/>
                            )
                        }
                        
                        <p className="text-2xl font-medium" >Đánh giá</p>
                    </div>
                    {showReview && (
                    <ul className=' flex items-start flex-col gap-y-[10px] p-[10px] bg-white'>
                        
                        <li className='text-xl cursor-pointer flex' value="0-1" onClick={(e) => handleFilterRate(e)}  >
                            

                        {
                                rate === "0-1" ? (
                                    <>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300 "/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                    </>
                                ) : (
                                    <>
                                    
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200 "/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                    </>
                                )
                            }
                            
                        </li>
                        
                       
                        
                        
                            

                        <li onClick={(e) => handleFilterRate(e)}  value="1-2" className='text-xl cursor-pointer flex'>
                            {
                                rate === "1-2" ? (
                                    <>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300 "/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                    </>
                                ) : (
                                    <>
                                    
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200 "/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                    </>
                                )
                            }
                        </li>

                        <li onClick={(e) => handleFilterRate(e)}  value="2-3" className='flex cursor-pointer text-xl '>
                        {
                                rate === "2-3" ? (
                                    <>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300 "/>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                    </>
                                ) : (
                                    <>
                                    
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200 "/>
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                    </>
                                )
                            }
                        </li>

                        <li onClick={(e) => handleFilterRate(e)}  value="3-4" className='text-xl cursor-pointer flex'>
                        {
                                rate === "3-4" ? (
                                    <>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300 "/>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiOutlineStar className="text-yellow-300"/>
                                    </>
                                ) : (
                                    <>
                                    
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200 "/>
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiOutlineStar className="text-yellow-200"/>
                                    </>
                                )
                            }
                        </li>

                        <li onClick={(e) => handleFilterRate(e)}  value="4-5" className='flex cursor-pointer text-xl'>
                        {
                                rate === "4-5" ? (
                                    <>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300 "/>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300"/>
                                        <AiFillStar className="text-yellow-300"/>
                                    </>
                                ) : (
                                    <>
                                    
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200 "/>
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200"/>
                                        <AiFillStar className="text-yellow-200"/>
                                    </>
                                )
                            }
                        </li>
                        
                    </ul>
                    )}
                </div>
                <div className=''>
                    <div className='flex items-center gap-x-[5px] rounded-bl rounded-br cursor-pointer bg-white p-[5px]' onClick={() => setShowPrice(!showPrice)}>
                        {
                            showPrice ? (
                                <AiFillCaretDown />
                            ) : (
                                <AiFillCaretDown className='-rotate-90'/>
                            )
                        }
                        
                        <p className="text-2xl font-medium" >Giá</p>
                    </div>
                    {showPrice && (
                    <ul className=' flex  flex-col gap-y-[10px] p-[10px] bg-white'>
                        
                        
                       
                            <li onClick={(e) => handleFilterPrice(e)}  value="0-1000000" className={` cursor-pointer w-full rounded border flex justify-start p-[5px] ${"0-1000000" === price ? "bg-[#cbf1ff] shadow-lg" : "hover:bg-[#cbf1ff] hover:shadow-lg"}   `}>
                                0 - 1,000,000
                            </li>
                        
                        
                        
                            <li onClick={(e) => handleFilterPrice(e)} value="1000001-10000000" className={` cursor-pointer w-full rounded border flex justify-start p-[5px] ${"1000001-10000000" === price ? "bg-[#cbf1ff] shadow-lg" : "hover:bg-[#cbf1ff] hover:shadow-lg"}`}>
                                1,000,001 - 10,000,000
                            </li>
                       
                        
                        
                            <li onClick={(e) => handleFilterPrice(e)} value="10000001-100000000" className={` cursor-pointer  w-full rounded border flex justify-start p-[5px] ${"10000001-100000000" === price ? "bg-[#cbf1ff] shadow-lg" : "hover:bg-[#cbf1ff] hover:shadow-lg"}`}>
                                10,000,001 - 100,000,000
                            </li>
                        
                    </ul>
                    )}
                </div>
                
                
            </div>
            
            <div className='col-span-4  rounded  '>
                <div className='flex justify-between bg-white p-[5px] items-center'>
                    <p className='text-xl'>{countProducts} kết quả</p>
                    <div>
                        <div className='relative cursor-pointer border rounded w-[150px] h-[40px] border rounded flex justify-between items-center px-[5px] ' onClick={() => setShow(!show)}>
                            {
                                sort === "highest" ? (<p>Giá giảm dần</p>) :
                                sort === "lowest" ? (<p>Giá tăng dần</p>) :
                                (<p>Sắp xếp</p>)

                            }
                            <AiFillCaretDown/>

                            {
                                show && (
                                    <div className='absolute w-[150px] z-1 z-10 top-[40px] left-0 bg-white rounded' >
                                        <ul className=''>
                                            <li onClick={(e) => handleFilterSort(e)} value="highest" className={`${sort === "highest" ? "bg-[#cbf1ff]" : "hover:bg-[#cbf1ff]"} p-[5px] cursor-pointer`}>
                                                Giá giảm dần
                                            </li>
                                            <li onClick={(e) => handleFilterSort(e)} value="lowest" className={`${sort === "lowest" ? "bg-[#cbf1ff]" : "hover:bg-[#cbf1ff]"} p-[5px] cursor-pointer`}>
                                                Giá tăng dần
                                            </li>
                                        </ul>
                                    </div>

                                )
                            }
                        </div>
                    </div>
                </div>

                <div className=' mt-[10px] rounded grid grid-cols-4 gap-[20px]'>
                {loading ? (
                    <div className='col-span-4'>

                        <LoadingBox/>
                    </div>
                    ) : error ? (
                        <div className='col-span-4'>

                            <MessageBox variant="danger">{error}</MessageBox>
                        
                        </div>
                    ) : (  
                        products.map((product) => (
                            <div>
                                <Product product={product}/>
                            </div>

                        ))
                    )}
                </div>
                <div className='mt-[20px] flex justify-center items-center'>
                
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pages}
                        onPageChange={handlePageChange}
                        number = {localStorage.getItem('shoppingCurrentPage')}
                    />

                </div>
            </div>
        </div>
        <Footer/>
        
    </div>
    
  )
};

export default Shopping;

