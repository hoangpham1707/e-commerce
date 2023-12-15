// ok


import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai"
import { BiCartAlt } from "react-icons/bi"
import { BsMessenger } from "react-icons/bs"
import Hearder from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store } from "../store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import FormatDes from "../components/formatDes";
import SubCate from "../components/subCate.jsx";
import Comment from "../components/Comment";
import Recommed from "../components/Recommed";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ProductScreen = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;

    const [seller, setSeller] = useState("")
    const [subCategories, setSubCategories] = useState(null);
    const [comments, setComments] = useState(null);
    // console.log(subCategories)
    // console.log(params.id)
    // const [productId, setProductId] = useState(null)
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/v4/product/${id}/getProductById`);
                const { data } = await axios.get(`/v4/user/${result.data.sellerId}/getSeller`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                setSubCategories(result.data.sub_categories);
                setComments(result.data.comments);

                // console.log(result.data)
                // console.log(data)
                setSeller(data.fullName)
                // console.log(result.data.sellerId)
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [id]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const result = await axios.get(`/v4/user/${product.sellerId}/getSeller`);
    //             setSeller(result.data.fullName)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     };
    //     fetchData();
    // }, [product.sellerId])

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    // const addToCartHandler = () => {
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/v4/product/${product._id}/getProductById`);
        if (data.quantity < quantity) {
            window.alert('Sản phẩm đã hết');
            return;
        }
        // console.log(...product, quantity)
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },

        });
        // navigate('/cart');
    };
    function formatNumberWithCommas(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    return (
        loading ? (
            <div className='col-span-4'>

                <LoadingBox />
            </div>
        ) : error ? (
            <div className='col-span-4'>

                <MessageBox variant="danger">{error}</MessageBox>

            </div>
        ) : (
            <div className="w-full bg-[#F1F5F9]">
                <Hearder />
                <div className="w-5/6 mx-auto  mt-[100px] py-[20px]">

                    <div className="w-full  rounded gap-x-[20px] bg-white shadow-lg mt-[10px]  p-[20px]">
                        <div className="flex ">

                            <div className="w-[50%]   rounded-lg flex justify-center items-center">
                                <img className="w-[50%] object-cover" src={product.images} alt="" />
                            </div>
                            {/* <div className="flex flex-1 flex-col   gap-y-[10px]">
                            <div className="flex  text-2xl font-medium">
                                <p>{product.name}</p>
                            </div>
                            <div className="flex gap-x-[10px]">
                                <p className="font-semibold">Sold by: </p>
                                <Link className="underline" to="/store">{product.sellerId}</Link>
                            </div>
                            <div>
                                <p className="font-semibold">Category: <span className="ml-[10px] font-normal">{product.category}</span></p>
                                
                            </div>

                            
                            <div >
                                <p className="font-semibold">Quantity: <span className="ml-[10px] font-normal">{product.quantity} products</span></p>
                            </div>
                            
                            <div className="flex gap-x-[10px] items-center">
                                <p className="font-semibold w-[40px]">Color:</p>
                                <ul className="flex gap-x-[20px]">
                                
                                
                                    <li className="flex items-center justify-center">
                                        <input id="white" type="radio" value="" name="color" checked class="w-4 h-4 " />
                                        <label for="white" class="ml-2 text-sm f ">White</label>
                                    </li>
                                    <li className="flex gap-x-[5px] items-center justify-center">
                                        <input id="black" type="radio" value="" name="color" class="w-4 h-4 " />
                                        <label for="black" class="ml-2 text-sm  ">Black</label>
                                    </li>
                                
                                </ul>
                            </div>
                            <div className="flex gap-x-[10px] items-center">
                                <p className="font-semibold w-[40px]">Size:</p>
                                <ul className="flex gap-x-[20px]">
                                
                                
                                    <li className="flex items-center justify-center">
                                        <input id="small" type="radio" value="" name="size" checked class="w-4 h-4 " />
                                        <label for="small" class="ml-2 text-sm f ">Small</label>
                                    </li>
                                    <li className="flex gap-x-[5px] items-center justify-center">
                                        <input id="big" type="radio" value="" name="size" class="w-4 h-4 " />
                                        <label for="big" class="ml-2 text-sm  ">Big</label>
                                    </li>
                                
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold">Price: <span className="font-normal line-through">{formatNumberWithCommas(product.price)}</span> <span className="font-normal">{formatNumberWithCommas(product.price)}</span></p>
                            </div>

                            <div className="">
                                <div className="flex items-center gap-x-[15px]">
                                    <AiFillHeart className="text-3xl text-red-500"/>
                                    <button onClick={addToCartHandler} >
                                        <BiCartAlt className="text-3xl"/>
                                    </button>
                                    <BsMessenger className="text-3xl"/>
                                </div>
                                <div className="flex w-[200px] rounded-md mt-[10px] bg-gray-300 justify-center items-center">
                                    <p className="font-semibold py-[4px] px-[8px]">Buy Now</p>
                                </div>
                            </div>
                        </div> */}
                            <div className="w-[40%] relative">

                                <div className="flex justify-center  flex-col  gap-y-[10px]">
                                    <h2 className="sr-only">Product information</h2>
                                    {/* <p className="text-3xl tracking-tight text-gray-900">{product.name}</p> */}
                                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                                    </div>
                                    <div className="">
                                        <h3 className="sr-only">Reviews</h3>
                                        <div className="flex items-center">
                                            <div className="flex items-center">

                                                <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                                <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                                <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                                <svg className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                                <svg className="text-gray-200 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="sr-only">{product.rate}</p>
                                            <p href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">{product.numberOfReviews} Đánh giá</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className=" text-sm mt-[5px] font-medium">Thể loại: <span className=" text-sm font-medium">{product.category}</span></p>
                                    </div>

                                    <div>
                                        <p className=" text-sm mt-[5px] font-medium">Người bán: <span className="underline cursor-pointer text-sm font-medium">{seller}</span></p>
                                    </div>

                                    <div>
                                        <p className=" text-sm mt-[5px] font-medium">Số lượng: <span className=" text-sm font-medium">{product.quantity}</span></p>
                                    </div>

                                    {/* <form className="mt-10">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Color</h3>

                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose a color</legend>
                                            <div className="flex items-center space-x-3">

                                                <label className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-gray-400">
                                                    <input type="radio" name="color-choice" value="White" className="sr-only" aria-labelledby="color-choice-0-label" />
                                                    <span id="color-choice-0-label" className="sr-only">White</span>
                                                    <span aria-hidden="true" className="h-8 w-8 bg-white rounded-full border border-black border-opacity-10"></span>
                                                </label>

                                                <label className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-gray-900">
                                                    <input type="radio" name="color-choice" value="Black" className="sr-only" aria-labelledby="color-choice-2-label" />
                                                    <span id="color-choice-2-label" className="sr-only">Black</span>
                                                    <span aria-hidden="true" className="h-8 w-8 bg-gray-900 rounded-full border border-black border-opacity-10"></span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                            <p href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</p>
                                        </div>

                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose a size</legend>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">

                                                <label className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-not-allowed bg-gray-50 text-gray-200">
                                                    <input type="radio" name="size-choice" value="XXS" disabled className="sr-only" aria-labelledby="size-choice-0-label" />
                                                    <span id="size-choice-0-label">XXS</span>
                                                    <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                                        <svg className="absolute inset-0 h-full w-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                                            <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
                                                        </svg>
                                                    </span>
                                                </label>

                                                <label className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                                    <input type="radio" name="size-choice" value="XS" className="sr-only" aria-labelledby="size-choice-1-label" />
                                                    <span id="size-choice-1-label">XS</span>

                                                    <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <button type="submit" className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add to bag</button>
                                </form> */}

                                    <SubCate subCategories={subCategories} />
                                    <div>
                                        <p className="text-3xl mt-[20px] tracking-tight text-gray-900">{formatNumberWithCommas(product.price)} VND</p>

                                    </div>
                                    <button onClick={addToCartHandler} className="mt-[10px] flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 ">Thêm vào giỏ hàng</button>

                                </div>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto pt-6">
                            <p className="font-semibold text-2xl">Mô tả về sản phẩm</p>
                            <FormatDes description={product.description} />
                            {/* <p className="font-semibold">Mô tả về sản phẩm:
                            <p className="ml-[10px] font-normal">{product.description}
                            </p>
                            </p> */}
                        </div>

                        <Comment data={{ comments, id }} />
                    </div>
                </div>

                <div>
                    <Recommed products={product} />
                </div>
                <Footer />
            </div>
        )
    )
}
export default ProductScreen;