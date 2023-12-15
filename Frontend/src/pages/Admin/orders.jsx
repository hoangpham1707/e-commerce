import React, { useState } from 'react'
import Hearder from '../../components/header';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import { getError } from '../../utils';
import axios from 'axios';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import SideBar from '../../components/sidebar';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload.orders, countOrders : action.payload.countOrders, loading: false };
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



const Orders = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [classify, setClassify] = useState("");
  const [{ loading, error, orders, countOrders, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/v4/order/getOrderAdmin?classify=${classify}`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: {orders : data.myOrder, countOrders: data.countOrders} });
        console.log(data)
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
  }, [userInfo, countOrders,classify, successDelete]);

  const updateStatus = async (order, status) => {
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      const {data} = await axios.put(`/v4/order/${order._id}/updateStatus`, 
        {status: status},
      
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      // setStatus("");
    } catch (error) {
      toast.error(getError(error));
      dispatch({
        type: 'DELETE_FAIL',
      });
    }
  };
  const formatNumberWithCommas = (number) =>  {
    return new Intl.NumberFormat('en-US').format(number);
}

  // console.log(userInfo)
  return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        <Hearder/>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
            
            <SideBar/>
            <div className='col-span-4 relative border rounded bg-white  p-[10px] shadow-lg'>
                <div className='flex  items-center justify-between'>

                    
                    <div className='flex  justify-between items-center'>
                      <p className='text-2xl font-medium'>Đơn hàng của tôi</p>
                      <div className='flex items-center gap-[5px]'>
                              
                              
                              
                              {/* <div className='flex items-center gap-[3px]'>

                                  <p className='text font-medium'>Yêu cầu xử lý</p>
                                  <div className='w-[25px] h-[25px] rounded-full flex justify-center items-center bg-red-500'>
                                      10
                                  </div>
                              </div> */}
                          </div>

                    </div>
                    <div className='flex items-center gap-[5px]'>
                        <p onClick={() => setClassify("")} className={`text-black/20 cursor-pointer font-medium ${classify === "" ? "text-black/100" : "" }  `}>Tất cả </p>
                        <p className='text-black/20'>|</p>
                        <div className='flex items-center gap-[3px]'>

                            <p onClick={() => setClassify("1")} className={`text-black/20 cursor-pointer font-medium ${classify === "1" ? "text-black/100" : "" }  `}>Yêu cầu xử lý</p>
                            {/* {
                              countOrders !== 0 && (

                              <div className='w-[25px] h-[25px] rounded-full flex justify-center items-center bg-red-300'>
                                  {countOrders}
                              </div>
                              )
                            } */}
                        </div>
                    </div>
                </div>
                {
                  loading ? ( 
                    <div className='col-span-4'>

                        <LoadingBox/>
                    </div>
                    ) : error ? (
                        <div className='col-span-4'>

                            <MessageBox variant="danger">{error}</MessageBox>
                        
                        </div>
                  ) : (
                <div className='w-full    text-lg font-semibold flex flex-col mt-[10px] gap-y-[10px]'>
                  {
                    orders.length !== 0 ? (orders.map((order) => (

                      <div className='rounded bg-gray-100 p-[20px]'>

                          <p>Mã đơn hàng: {order.orderCode}</p>
                          <p>Trạng thái đơn hàng: {order.orderStatus}</p>
                          <p>Trạng thái thanh toán: {order.paymentStatus}</p>
                          <div>
                            {
                              order.orderItems.map((item) => (

                                <div className='flex items-center'>
                                    <img className='w-[150px] ' src={item.image} alt="" />
                                    <div className='flex flex-col gap-y-[20px]'>
                                        <p>{item.name} </p>
                                        <p>{formatNumberWithCommas(item.price)} x {item.quantity} </p>
                                    </div>
                                </div>
                              ))
                            }
                          </div>


                              <div className='flex flex-col gap-y-[10px]'>
                                  <p className='flex flex-row-reverse'> Tổng tiền: {formatNumberWithCommas(order.totalPrice)} VND</p>
                                      {/* <button className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Hủy đơn</button> */}
                                      {
                                        order.orderStatus === "Chờ xử lý" ? (
                                          <div className='flex flex-row-reverse gap-[10px]'>

                                           <button onClick={()=> updateStatus(order, "Đã nhận hàng")}  className='hover:bg-[#cbf1ff] bg-gray-200 shadow-lg px-[40px] py-[10px] rounded'>Không đồng ý hoàn tiền</button>
                                           <button onClick={()=> updateStatus(order, "Đang hoàn tiền")}  className='hover:bg-[#cbf1ff] bg-gray-200 shadow-lg px-[40px] py-[10px] rounded'>Đồng ý hoàn tiền</button>
                                           <button onClick={ () => {navigate(`/orderdetail/${order._id}`)}} className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Xem chi tiết</button>
                                          </div>
                                        ) : order.orderStatus === "Đang hoàn tiền" ? (
                                          <div className='flex flex-row-reverse gap-[10px]'>

                                           <button onClick={()=> updateStatus(order, "Hoàn tiền thành công")}  className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Hoàn tiền</button>
                                           <button onClick={ () => {navigate(`/orderdetail/${order._id}`)}} className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Xem chi tiết</button>
                                           
                                          </div>
                                        ) : order.orderStatus === "Hoàn tiền thành công" ? (
                                          <div className='flex flex-row-reverse gap-[10px]'>

                                           <button onClick={ () => {navigate(`/orderdetail/${order._id}`)}} className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Xem chi tiết</button>
                                           
                                           
                                          </div>
                                        ) : (<div className='flex flex-row-reverse gap-[10px]'>

                                        <button onClick={ () => {navigate(`/orderdetail/${order._id}`)}} className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Xem chi tiết</button>
                                        
                                        
                                       </div>)
                                      }
                              </div>
          
                              
                      </div>
                    )) ) :  (
                      
                      <div className='flex justify-center items-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                        Không có đơn hàng nào
                      </div>
                    
                  )


                  }

                    

                </div>

                  )
                }
                
                
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Orders;