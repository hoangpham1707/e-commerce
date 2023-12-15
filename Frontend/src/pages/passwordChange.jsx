import React from 'react'
import Hearder from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import { useContext, useReducer, useState } from 'react';
import { Store } from '../store';
import ImageUploading from 'react-images-uploading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import SideBar from '../components/sidebar';
import {BiPlusCircle} from 'react-icons/bi'
const reducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false };
  
      default:
        return state;
    }
  };
  

const PassWordChange = () => {
const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  

 
    console.log(userInfo)

    

    const submitHandler = async (e) => {
        e.preventDefault();
        if(newPassword !== confirmPassword){
          toast.error("Mật khẩu không trùng khớp")
        } else {
          
          try {
            const { data } = await axios.put(
              '/v4/user/changepass',
              {
                oldPassword, newPassword
              },
              {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              }
            );
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success('Đổi mật khẩu thành công');
          } catch (err) {
            toast.error(getError(err));
          }
        }
      };
  return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        
        <Hearder/>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
           
            <SideBar/>
            <div className='col-span-4 bg-white rounded  p-[10px] shadow-lg'>
                <div>
                    <p className='text-xl font-medium'>

                        Đổi mật khẩu
                    </p>
                </div>
                <div className='flex flex-col justify-center items-center gap-[50px] mt-[20px]'>
              

                    <div className=' rounded w-[50%] grid grid-cols-7'>
                        <ul className='col-span-2  flex flex-col gap-y-[20px] '>
                            <li className='flex  items-center h-[36px] '>
                                Mật khẩu hiện tại:
                            </li>

                            <li className='flex  items-center h-[36px] '>
                                Mật khẩu mới:
                            </li>
                            
                            <li className='flex  items-center h-[36px] '>
                                Xác nhận mật khẩu:
                            </li>
                            
                        </ul>

                        <ul className='col-span-5 flex flex-col gap-y-[20px]'>
                            

                            <li>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className='outline-none w-full border rounded h-[36px] px-[10px]'/>
                            </li>
                            <li>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  className='outline-none w-full border rounded h-[36px] px-[10px]'/>
                            </li>

                            <li>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='outline-none w-full border rounded h-[36px] px-[10px]'/>
                            </li>
                        </ul>
                    </div>

                    <div onClick={submitHandler}  className='rounded w-[50%] cursor-pointer bg-[#cbf1ff] shadow-lg flex justify-center items-center py-[10px]'>
                        <button >Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default PassWordChange;