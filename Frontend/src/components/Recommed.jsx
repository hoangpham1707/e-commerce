import React, { useEffect, useReducer, useRef, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import axios from 'axios';
import Product from "./product";
import { useParams } from 'react-router-dom';
import RecommendList from './RecommendList';
import logger from 'use-reducer-logger';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

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

const Recommed = () => {
    const { id } = useParams();
    const [recomend, setRecommend] = useState([]);

    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: '',
    });

    const effectRan = useRef(false)
    useEffect(() => {
        // if (effectRan.current === false) {
        const fetchRecommend = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const data = { obj_id: id };
                const res = await axios.post(`http://localhost:5000/receive`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
                setRecommend(res.data);
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                console.error('Error fetching recommendations:', error);
            }
        }
        fetchRecommend();
        return () => {
            effectRan.current = true;
        }
    }
        // }
        , [id]);

    console.log(recomend)
    if (!recomend) {
        return <p>Loading...</p>;
    }

    return (
        <div className="w-5/6 mx-auto my-8">
            <div className="flex justify-between items-center ">
                <p className="font-semibold">Sản phẩm tương tự</p>
                {/* <div className="flex items-center">
                    <p className="font-semibold">More</p>
                    <BiChevronRight />
                </div> */}
            </div>
            <div className="flex justify-between mt-4">
                {loading ? (

                    <LoadingBox />
                ) : error ? (

                    <MessageBox variant="danger">{error}</MessageBox>

                ) : (

                    <RecommendList products={recomend} />
                )
                }

            </div>
        </div>
    )
}

export default Recommed