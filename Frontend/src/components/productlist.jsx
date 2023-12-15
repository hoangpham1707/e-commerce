import React, { useState } from "react";
import { useEffect, useReducer } from "react";
import { BiChevronRight } from "react-icons/bi"

import logger from 'use-reducer-logger';

import axios from "axios";
import Product from "./product";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";
import { Link } from "react-router-dom";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ProductList = () => {



    // const [products, setProducts] = useState([]);
    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async (page) => {
            // const result = await axios.get('/api/products');
            // setProducts(result.data);
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/v4/product/getAllProducts`);
                // setProducts(response.data.products);

                dispatch({ type: 'FETCH_SUCCESS', payload: result.data.products });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, []);


    return (
        <div className="w-full bg-[#F1F5F9] mt-[100px]  py-[20px]">
            <div className="w-5/6 mx-auto ">
                <div className="flex justify-between  items-center ">
                    <p className="font-semibold">Đề xuất cho bạn</p>
                    <Link to="/shopping">
                        <div className="flex items-center ">
                            <p className="font-semibold">Xem thêm</p>
                            <BiChevronRight />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-5 gap-[20px] mt-[10px]">
                    {loading ? (
                        <div className='col-span-5'>

                            <LoadingBox />
                        </div>
                    ) : error ? (
                        <div className='col-span-5'>

                            <MessageBox variant="danger">{error}</MessageBox>

                        </div>
                    ) : (

                        products.map((product) => (
                            <div key={product._id}>

                                <Product product={product} />
                            </div>

                        ))
                    )
                    }



                </div>

            </div>

        </div>
    )
}
export default ProductList;