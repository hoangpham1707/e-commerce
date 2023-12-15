import React from "react";

import { BiChevronRight } from "react-icons/bi"
import { AiFillStar } from "react-icons/ai"
import { BsFillEyeFill } from "react-icons/bs"
import { AiFillHeart } from "react-icons/ai"
import { BiCartAlt } from "react-icons/bi"
import { Link } from "react-router-dom";
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../store';

const Product = (props) => {
    const { product } = props;

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const truncateDescription = (description, maxLength) => {
        if (description.length >= maxLength) {
            return description.substring(0, maxLength) + '...';
        } else {
            return description + '                        '
        }

    };

    const formatNumberWithCommas = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    }

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`v4/product/${item._id}/getProductById`);
        if (data.quantity < quantity) {
            window.alert('Đã hết hàng');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    return (


        <div className=" bg-white border p-[10px] rounded shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="  flex justify-center items-center  rounded mx-auto object-cover">
                <Link to={`/product/${product._id}`}>

                    <div className="  flex justify-center items-center  rounded mx-auto object-cover">
                        <img className=" object-contain h-[300px]" src={product.images} alt="" />
                    </div>


                    <div className="flex mt-[10px]  justify-between  font-medium">
                        <p className="h-14">{truncateDescription(product.name, 46)}</p>
                        {
                            product.name.length <= 28 && <br />
                        }


                    </div>

                    <div className="flex items-center  justify-between  my-[5px]">
                        <div className="flex items-center gap-[5px] ">
                            <p className="font-medium text-sm">{product.rate}</p>
                            <AiFillStar className="text-yellow-300 " />

                        </div>

                        <div className="flex gap-[5px]">
                            <p className="text-sm font-medium">Đã bán</p>
                            <p className="text-sm font-medium">{product.numberOfReviews}</p>
                        </div>
                    </div>
                    <div className=" items-center ">
                        {/* <div className="flex items-center gap-[2px]">
                    <p className="font-semibold text-sm line-through">{formatNumberWithCommas(product.price * 2)}</p>
                    <p className="text-red-500 text-xs">-50%</p>
                </div> */}
                        <p className="font-semibold text-xl text-un">{formatNumberWithCommas(product.price)}</p>

                    </div>
                </Link>
            </div>
        </div>


    )
}
export default Product;