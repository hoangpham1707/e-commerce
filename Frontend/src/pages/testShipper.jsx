import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { getError } from '../utils';
import { Store } from '../store';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, orders: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
        return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
        return {
            ...state,
            loadingDelete: false,
            successDelete: true,
        };
    case 'DELETE_FAIL':
        return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false };
      default:
        return state;
    }
  };

const TestShipper = () => {

    const { state } = useContext(Store);
    
    const [classify, setClassify] = useState("");
    
    
    const [{ loading, error, orders, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
      });
      useEffect(() => {
        const fetchData = async () => {
          dispatch({ type: 'FETCH_REQUEST' });
          try {
            const { data } = await axios.get(
              `/v4/order/getOrderShipper?classify=${classify}`,
    
              
            );
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (error) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(error),
            });
          }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
          } else {
            fetchData();
          }
        }, [ classify, successDelete]);
    //   console.log(orders)
      const formatNumberWithCommas = (number) =>  {
        return new Intl.NumberFormat('en-US').format(number);
    }

    const updateStatus = async (order, status) => {
        try {
          dispatch({ type: 'DELETE_REQUEST' });
          const {data} = await axios.put(`/v4/order/${order._id}/updateStatus`, 
            {status: status},
          );
          dispatch({ type: 'DELETE_SUCCESS' });
          
        } catch (error) {
          toast.error(getError(error));
          dispatch({
            type: 'DELETE_FAIL',
          });
        }
      };
      
  return (
    <div className='  bg-[#F1F5F9] fixed top-0 bottom-0 left-0 right-0'>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-[50%] mt-[100px] mx-auto'>
            <div className='rounded h-[50px] bg-white shadow-lg flex items-center justify-between px-[10px]'>
                <p className='text-xl font-medium'>Giao hàng</p>
                <div className='flex gap-x-[10px]'>
                    <p onClick={() => {setClassify("")}} className={`px-[8px] py-[4px] cursor-pointer ${classify === "" ? "bg-[#cbf1ff] shadow-lg" : "border shadow-lg" }  rounded-3xl`}>Đang giao</p>
                    <p onClick={() => {setClassify("1")}} className={`px-[8px] py-[4px] cursor-pointer ${classify === "1" ? "bg-[#cbf1ff] shadow-lg" : "border shadow-lg" } rounded-3xl`}>Đã giao xong</p>
                </div>
            </div>
            <div className='mt-[10px] flex flex-col gap-[10px]'>
                {
                    orders &&
                orders.map( (order) => (

                    <div className='rounded  bg-white shadow-lg flex flex-col gap-[10px] p-[10px] '>
                        <div className='flex gap-[10px]'>
                            <div className='w-[100px] h-[100px] rounded bg-red-200 '>
                                <img className='object-contain' src={order.orderItems[0].image} alt="" />
                            </div>

                            <div className='flex flex-col'>
                                <p className='text-lg font-medium'>{order.orderItems[0].name}</p>
                                <p>Tổng tiền phải thu: {formatNumberWithCommas(order.totalPrice)} VND</p>
                                <div className='flex items-center gap-[30px]'>
                                    
                                    
                                        <p>Người nhận: {order.shippingAddress.fullName} </p> 
                                        <p>SĐT: {order.shippingAddress.phoneNumber}</p> 
                                        <p>Địa chỉ: {order.shippingAddress.address}</p>

                                    
                                </div>
                                
                            </div>
                        </div>
                        <div className='flex gap-[10px] items-center'>
                            <p className='font-medium'>Trạng thái:</p>
                            
                                {
                                    order.orderStatus === "Đã chuẩn bị xong" ? (
                                        <div className='flex gap-[20px]'>
                                            <p onClick={()=> updateStatus(order, "Đơn vị vận chuyển đã lấy hàng")}   className={`bg-[#cbf1ff] shadow-lg cursor-pointer px-[8px] py-[4px]  rounded-3xl`}>Lấy hàng</p>
                                            <p  className={`px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg rounded-3xl`}>Giao hàng</p>
                                            <p  className={`px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg rounded-3xl`}>Đã giao xong</p>
                                        </div>
                                    ) : order.orderStatus === "Đơn vị vận chuyển đã lấy hàng" ? (
                                        <div className='flex gap-[20px]'>
                                            <p  className={`  px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg  rounded-3xl`}>Lấy hàng</p>
                                            <p onClick={()=> updateStatus(order, "Đang giao hàng")}  className={`px-[8px] py-[4px] bg-[#cbf1ff] shadow-lg cursor-pointer  rounded-3xl`}>Giao hàng</p>
                                            <p  className={`px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg  rounded-3xl`}>Đã giao xong</p>
                                        </div>
                                    ) : order.orderStatus === "Đang giao hàng" ? (
                                        <div className='flex gap-[20px]'>
                                            <p  className={`  px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg rounded-3xl`}>Lấy hàng</p>
                                            <p  className={`px-[8px] py-[4px] cursor-not-allowed bg-gray-200 shadow-lg   rounded-3xl`}>Giao hàng</p>
                                            <p onClick={()=> updateStatus(order, "Đã giao xong")}  className={`px-[8px] py-[4px]  bg-[#cbf1ff] shadow-lg cursor-pointer  rounded-3xl`}>Đã giao xong</p>
                                        </div>
                                    ) : (
                                        <div className='flex gap-[20px]'>
                                            <p className={`  px-[8px] py-[4px] cursor-not-allowed bg-[#cbf1ff] shadow-lg  rounded-3xl`}>Hoàn thành</p>
                                        </div>
                                    )
                                }
                                
                            
                        </div>
                    </div>
                ))
                } 
            </div>
        </div>
    </div>
  )
}

export default TestShipper;