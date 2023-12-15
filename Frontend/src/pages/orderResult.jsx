
import Hearder from '../components/header';
import Footer from '../components/footer';
import gif from '../thankyou.gif'
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../store';
import { getError } from '../utils';
import { ReactComponent as Error } from '../error.svg';
import { ReactComponent as Success } from '../success.svg';

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
const OrderResult = ()  => {


  const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    console.log(orderId)
    // const ordercode = params.ordercode
    
    const navigate = useNavigate();

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });
    
    useEffect(() => {
        const fetchOrder = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/v4/order/${orderId}/getOrderResult`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
    
        if (!userInfo) {
          return navigate('/login');
        }
        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
          }
        }, [order, userInfo, orderId, navigate]);
  
  // const orderTotalPrice = localStorage.getItem('orderTotalPrice')
  // const orderId = localStorage.getItem('orderId')
  // const payment = localStorage.getItem('payment')
  // const ViewDetailHandle =  () => {
  //   navigate(`/order/${orderId}`);
  // }
 
  // useEffect(() => {
   

  // //   // Xóa dữ liệu khi component unmount (chuyển sang trang khác)
  // //   return () => {
  // //     localStorage.removeItem('orderTotalPrice');
  // //     localStorage.removeItem('orderId');
  // //   };
  // }, []);
  const formatNumberWithCommas = (number) =>  {
    return new Intl.NumberFormat('en-US').format(number);
  }
  
  
  

    
    
  return (
    loading ? (
      <div className='col-span-4'>

                        <LoadingBox/>
                    </div>
                    ) : error ? (
                        <div className='col-span-4'>

                            <MessageBox variant="danger">{error}</MessageBox>
                        
                        </div>
     ) : (

    
      <div className='w-full mt-[100px] bg-[#F1F5F9]'>
      <Hearder/>
      <div className='w-5/6 mx-auto flex justify-center flex-col items-center py-[20px]'>

        {/* <img src={gif} alt="" /> */}
        <Success  />
        <div className='border py-[40px] px-[50px] flex flex-col  rounded bg-white mt-[10px] shadow-lg'>
          
        <p className='text-2xl font-medium'>Bạn đã đặt hàng thành công </p>

        {
          order.paymentMethod === 'Thanh toán tiền mặt khi nhận hàng' ? (
            <p className='text-xl font-thin pt-[10px] pb-[30px]'>Hãy chuẩn bị tiền mặt {formatNumberWithCommas(order.totalPrice)} VND </p>

          ) : (
            
            <p className='text-xl font-thin pt-[10px] pb-[30px]'>Bạn đã thanh toán thành công {formatNumberWithCommas(order.totalPrice)} VND  </p>
          )
        }
          
              
          
        

        <div className='w-full flex gap-x-[10px]'>

          <button onClick={() => {navigate(`/orderhistory`)}} className='w-[50%] py-[10px] bg-gray-300 rounded'>Xem đơn hàng</button>
          <button onClick={() => {navigate('/')}} className='w-[50%] py-[10px] bg-gray-300 rounded'>Về trang chủ</button>
        </div>

        </div>
        
      </div>
      <div class="flex items-center justify-center ">
   
    
</div>

      <Footer/>
    </div>
     )
  )
}

export default OrderResult;