import React from 'react'
import {ReactComponent as LoginImage} from "../login.svg"
import {FaFacebook} from "react-icons/fa"
import {FcGoogle} from "react-icons/fc"
import Hearder from '../components/header'
import Footer from '../components/footer'
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../store'
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getError } from '../utils';
// import { getError } from '../utils';
const SignupScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
  
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const address = "";
    const images="";
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const submitHandler = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      try {
        const { data } = await Axios.post('/v4/user/register', {
          fullName,
          phoneNumber,
          email,
          password,
          address,
          images,
        });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect || '/');
      } catch (err) {
        toast.error(getError(err));
      }
    };
  
    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);
    console.log({fullName,
        phoneNumber,
        email,
        password,
        address,
        images,})
    return (
        <div className='w-full mt-[100px]  bg-[#F1F5F9]'>
            <Hearder/>
            <ToastContainer position="top-right" limit={1} />
            <div className='w-5/6 mx-auto py-[20px] '>
                <div className='flex w-11/12 mx-auto bg-white shadow-lg rounded-lg '>
                    <div className='w-[50%]  '>
                        <form  className='w-[50%] mx-auto py-[30px]'>
                            <div className='flex flex-col items-center'>
                                <p className='font-medium text-xl'>Sign in</p>
                                <p className='font-thin'>Please register and experience with us.</p>
                            </div>
                            <div className='flex flex-col gap-y-[12px] mt-[30px]'>
                                <div>
                                    <label className="font-medium block" htmlFor="">FullName</label>
                                    <input required onChange={(e) => setFullName(e.target.value)}  className='outline-none border w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-30 placeholder:font-thin placeholder:italic' type="text"  placeholder='Enter your fullname' />
                                </div>

                                <div>
                                    <label className="font-medium block" htmlFor="">PhoneNumber</label>
                                    <input required onChange={(e) => setPhoneNumber(e.target.value)}  className='outline-none border w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-30 placeholder:font-thin placeholder:italic' type="text"  placeholder='Enter your phonenumber' />
                                </div>

                                <div>
                                    <label className="font-medium block" htmlFor="">Email</label>
                                    <input required onChange={(e) => setEmail(e.target.value)}   className='outline-none border w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-30 placeholder:font-thin placeholder:italic' type="email"  placeholder='Enter your email' />
                                </div>

                                <div>
                                    <label className="block font-medium" htmlFor="">Password</label>
                                    <input required onChange={(e) => setPassword(e.target.value)}  className='outline-none border w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-30 placeholder:font-thin placeholder:italic' type="password" placeholder='********' />
                                </div>

                                <div>
                                    <label className="block font-medium" htmlFor="">Password Confirm</label>
                                    <input required onChange={(e) => setConfirmPassword(e.target.value)}  className='outline-none border w-full flex items-center pl-[10px] h-[30px] rounded placeholder:opacity-30 placeholder:font-thin placeholder:italic' type="password" placeholder='********' />
                                </div>

                                
                                
                                <button onClick={submitHandler} className='bg-[#cbf1ff] shadow-lg w-full h-[40px] rounded font-medium'>Sign up</button>
                                

                                
                                {/* <button className='flex items-center bg-gray-100 w-full  h-[30px] my-[10px] rounded gap-x-[10px] justify-center'>
                                

                                        <FaFacebook className='text-blue-400 text-xl'/>
                                        <p className='font-medium'>Sign in with Facebook</p>
                                    
                                </button>
                                

                                
                                <button className='flex items-center bg-gray-100 w-full  h-[30px] rounded gap-x-[10px] justify-center'>
                                    <FcGoogle className='text-xl'/>
                                    <p className='font-medium'>Sign in with Google</p>
                                </button> */}
                                
                                <div className='flex justify-center'>
                                    <p className='font-thin text-black/50'>Do you already have an account? </p>
                                    <Link to={`/signin?redirect=${redirect}`} className="font-medium text-blue-400 underline" >Sign in</Link>
                                </div>
                            </div>
                        
                    
                        </form>
                    </div>
                    <div className='w-[50%]  flex items-center justify-center'>
                        <LoginImage className=''/>
                    </div>
                </div>
            </div>
            <Footer/>
            
        </div>
    )
}

export default SignupScreen;