import React from "react";
import { BiCartAlt, BiUserCircle } from "react-icons/bi"
import { AiFillHeart, AiOutlineSearch } from "react-icons/ai"
import { TiDeleteOutline } from "react-icons/ti"
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../logo.svg';
import { useContext, useState } from "react";
import { Store } from "../store";
import { useNavigate } from 'react-router-dom';
import Search from "./Search";

const Hearder = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;


    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
    };
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/shopping/?query=${query}` : '/shopping');

    };
    return (
        <div className="w-full fixed z-10 top-0 bg-white">
            <div className="flex w-5/6 mx-auto items-center justify-between py-4">
                <Link to="/">
                    <Logo />

                </Link>
                <div className="flex justify-between items-center w-2/5  text-xl rounded-full h-full">
                    <div className="w-[85%] ml-[2rem] flex justify-between items-center">
                        {/* <input  onChange={(e) => setQuery(e.target.value)} className=" w-11/12 h-[3.125rem] outline-none " type="text" placeholder="Search..." /> */}
                        <Search />
                    </div>
                    <button onClick={submitHandler}>

                        <AiOutlineSearch className="mr-[1.25rem] text-2xl" />
                    </button>
                </div>
                <div>
                    {
                        userInfo && userInfo.role === "seller" ?
                            (
                                <ul className="flex justify-center gap-x-10">

                                    <li className="">
                                        <Link className="font-medium" to="/myshop">Cửa hàng của tôi</Link>
                                    </li>
                                    <li className="">
                                        <Link className="font-medium" to="/shopping">Mua sắm</Link>
                                    </li>
                                    {/* <li className="">
                            <a href="/#">Blog</a>
                        </li> */}
                                    <li className="font-medium" >
                                        <Link to="/about" >Thông tin</Link>
                                    </li>
                                    <li className="font-medium">
                                        <Link to="/contact">Liên hệ</Link>
                                    </li>
                                </ul>

                            ) : (
                                <ul className="flex justify-center gap-x-10">

                                    <li className="">
                                        <Link className="font-medium" to="/shopping">Mua sắm</Link>
                                    </li>
                                    {/* <li className="">
                                    <a href="/#">Blog</a>
                                </li> */}
                                    <li className="">
                                        <Link className="font-medium" to="/about" >Thông tin</Link>
                                    </li>
                                    <li className="">
                                        <Link className="font-medium" to="/contact">Liên hệ</Link>
                                    </li>
                                </ul>
                            )
                    }
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="border flex justify-center items-center rounded-full w-[2.5rem] h-[2.5rem] relative">

                        <AiFillHeart className="text-xl" />

                        {/* <div className="flex items-center justify-center border bg-orange-400 rounded-full w-[1.5rem] h-[1.5rem] absolute bottom-5 left-6">
                            0
                        </div> */}
                    </div>
                    <Link to="/cart">
                        <div className="border flex justify-center items-center rounded-full w-[2.5rem] h-[2.5rem] relative">
                            <BiCartAlt className="text-xl" />




                            {
                                cart.cartItems.length > 0 && (

                                    <div className="flex items-center justify-center border bg-orange-400 rounded-full w-[1.5rem] h-[1.5rem] absolute bottom-5 left-6">
                                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                        {/* {cart.cartItems.length} */}
                                    </div>
                                )
                            }

                        </div>

                    </Link>
                    <div >
                        {
                            userInfo ? (
                                <Link to="/profile">
                                    {/* <BiUserCircle className="text-[3rem]"/> */}
                                    <div className="w-[48px] h-[48px] rounded-full bg-gray-300 overflow-hidden">
                                        <img className="object-contain" src={userInfo.images} alt="" />
                                    </div>

                                </Link>
                            ) : (
                                <Link to="/signin">
                                    <BiUserCircle className="text-[3rem]" />
                                </Link>
                            )
                        }

                    </div>
                </div>
            </div>

        </div>
    )
}
export default Hearder;