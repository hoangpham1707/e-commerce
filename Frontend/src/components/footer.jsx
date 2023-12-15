import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <div className="w-full bg-white bottom-0" >
            <div className="flex w-5/6 mx-auto gap-x-[200px] py-5 justify-between">
                <div className="flex flex-col gap-y-[5px]">
                    <h1 className="font-semibold text-xl">Company</h1>
                    <Link to="/shopping">Shopping</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>


                </div>
                <div className="flex flex-col gap-y-[5px]">
                    <h1 className="font-semibold text-xl" >Top Categories</h1>
                    <Link to="">Technology</Link>
                    <Link to="">Clothes</Link>
                    <Link to="">SmartPhone</Link>
                </div>
                <div className="flex flex-col gap-y-[5px]">
                    <h1 className="font-semibold text-xl">My account</h1>
                    <Link to="">Profile</Link>
                    <Link to="">Favorites</Link>
                    <Link to="">Cart</Link>
                    <Link to="">Change Password</Link>
                </div>
                <div className="flex flex-col gap-y-[5px]">
                    <h1 className="font-semibold text-xl">Connections</h1>
                    <Link to="">Facebook</Link>
                    <Link to="">Instagram</Link>
                    <Link to="">Twitter</Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;