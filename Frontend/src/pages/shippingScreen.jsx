import React from 'react'
import Hearder from '../components/header';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { useContext, useEffect, useState } from 'react';
import {ReactComponent as ShipImage} from "../ship.svg"
const ShippingAddressScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress, paymentMethod },
    } = state;
    
    
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [email, setEmail] = useState(shippingAddress.email || '');
    const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber || '');
    useEffect(() => {
        if (!userInfo) {
        navigate('/signin?redirect=/shipping');
        } 
    }, [userInfo, navigate]);
    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                email,
                phoneNumber,
            },
        });
        localStorage.setItem(
        'shippingAddress',
        JSON.stringify({
            fullName,
            address,
            email,
            phoneNumber,
            })
        );
        if(paymentMethod === ""){

            navigate('/paymentmethod');
        } else {
            navigate('/placeorder')
        }
    };
    return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
            <Hearder/>
            <div className='w-5/6 mx-auto  py-[20px]'>
                <div className='flex w-11/12 mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
                    <div className='w-[50%] flex justify-center items-center  '>
                        <form onSubmit={submitHandler}  className='w-[50%] mx-auto '>
                            <div className='flex flex-col items-center'>
                                <p className='font-medium text-xl'>Thông tin người nhận</p>
                                
                            </div>
                            <div className='flex flex-col gap-y-[12px] mt-[30px]'>

                                <div>
                                    <label className="font-medium block" htmlFor="">Họ tên</label>
                                    <input onChange={(e) => setFullName(e.target.value)} value={fullName} required  className='outline-none w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-50 placeholder:font-thin placeholder:italic border' type="text"  placeholder='Nhập họ tên của bạn' />
                                </div>
                                <div>
                                    <label className="block font-medium" htmlFor="">Địa chỉ</label>
                                    <input onChange={(e) => setAddress(e.target.value)} value={address} required  className='outline-none w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-50 placeholder:font-thin placeholder:italic border' type="text" placeholder='Nhập địa chỉ của bạn' />
                                </div>

                                <div>
                                    <label className="block font-medium" htmlFor="">Email</label>
                                    <input onChange={(e) => setEmail(e.target.value)} value={email} required  className='outline-none w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-50 placeholder:font-thin placeholder:italic border' type="email" placeholder='Nhập email của bạn' />
                                </div>

                                <div>
                                    <label className="block font-medium" htmlFor="">Số điện thoại</label>
                                    <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} required className='outline-none w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-50 placeholder:font-thin placeholder:italic border' type="tel" placeholder='Nhập số điện thoại của bạn' pattern="[0-9]{10}" />
                                </div>

                                
                                
                                <button className='bg-[#cbf1ff] w-full mt-[10px] h-[40px] rounded font-medium shadow-lg'>Tiếp theo</button>
                                

                                
                                
                                
                                
                            </div>
                        
                    
                        </form>
                    </div>
                    <div className='w-[50%] bg-white  flex items-center justify-center'>
                        <ShipImage className=''/>
                    </div>
                </div>
            </div>
            <Footer/>
            
        </div>
  )
}

export default ShippingAddressScreen;