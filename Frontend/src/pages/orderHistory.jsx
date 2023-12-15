import React, { useState } from 'react'
import Hearder from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import SideBar from '../components/sidebar';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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





const OrderHistory = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [classify, setClassify] = useState("");
  const [reason, setReason] = useState("");
  const [order, setOrder] = useState({});
  
  const [reasonRefund, setReasonRefund] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const [{ loading, error, orders, countOrders, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/v4/order/getMyOrderUser?classify=${classify}`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: {orders: data.myOrder, countOrders: data.countOrders} });
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
  }, [userInfo,classify, successDelete]);
  const formatNumberWithCommas = (number) =>  {
    return new Intl.NumberFormat('en-US').format(number);
}
const cancelHandler =  async(order) => {
  try {
    dispatch({ type: 'DELETE_REQUEST' });
    const {data} = await axios.post(`/v4/order/${order._id}/userCancelOrder`,
    {
      reason,
    },
    {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      
    });
    setReason("");
    setOrder({});
    toast.success('Hủy đơn thành công');
    dispatch({ type: 'DELETE_SUCCESS' });
  } catch (error) {
    toast.error(getError(error));
    dispatch({
      type: 'DELETE_FAIL',
    });
  }
}

const refundHandler =  async(orderRefund) => {
  try {
    dispatch({ type: 'DELETE_REQUEST' });
    const {data} = await axios.post(`/v4/order/${orderRefund._id}/userRefundOrder`,
    {
      reasonRefund,
    },
    {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      
    });
    setReasonRefund("");
    setOrder({});
    toast.success("Gửi yêu cầu hoàn tiền thành công");
    dispatch({ type: 'DELETE_SUCCESS' });
  } catch (error) {
    toast.error(getError(error));
    dispatch({
      type: 'DELETE_FAIL',
    });
  }
}

const select = async(order) =>{
  setOrder(order)
}
const stopPropagation = (event) => {
  event.stopPropagation();
};



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

  // console.log(userInfo)
  return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        <Hearder/>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
            
            <SideBar/>
            <div className='relative col-span-4 border rounded bg-white  p-[10px] shadow-lg'>
              <div className='flex justify-between items-center'>

                <p className='text-2xl font-medium'>Lịch sử mua hàng</p>
                <div className='flex items-center gap-[5px]'>
                        <p onClick={() => setClassify("")} className={` text-black/20 cursor-pointer font-medium ${classify === "" ? "text-black/100" : "" }  `}>Tất cả </p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("1")} className={`text-black/20 cursor-pointer font-medium ${classify === "1" ? "text-black/100" : "" }  `}>Chờ xác nhận</p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("2")} className={`text-black/20 cursor-pointer font-medium ${classify === "2" ? "text-black/100" : "" }  `}>Đang xử lý</p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("3")} className={`text-black/20 cursor-pointer font-medium ${classify === "3" ? "text-black/100" : "" }  `}>Đang giao hàng</p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("4")} className={`text-black/20 cursor-pointer font-medium ${classify === "4" ? "text-black/100" : "" }  `}>Đã nhận </p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("5")} className={`text-black/20 cursor-pointer font-medium ${classify === "5" ? "text-black/100" : "" }  `}>Đã hủy </p>
                        <p className='text-black/20'>|</p>
                        <p onClick={() => setClassify("6")} className={`text-black/20 cursor-pointer font-medium ${classify === "6" ? "text-black/100" : "" }  `} >Hoàn tiền </p>
                        
                        {/* <div className='flex items-center gap-[3px]'>

                            <p className='text font-medium'>Yêu cầu xử lý</p>
                            <div className='w-[25px] h-[25px] rounded-full flex justify-center items-center bg-red-500'>
                                10
                            </div>
                        </div> */}
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
                <div className='w-full  text-lg font-semibold flex flex-col mt-[10px] gap-y-[10px]'>
                  {
                    orders.length !== 0 ? ( orders.map((order) => (

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
                                  <div className='flex flex-row-reverse gap-[10px]'>
                                    { 
                                      order.orderStatus === "Chờ xác nhận" || order.orderStatus === "Đang chuẩn bị hàng" || order.orderStatus === "Đã chuẩn bị xong" ? 
                                      (

                                        <button onClick={() => {select(order);setTitle("Lý do hủy đơn"); setShowModal(true)}} className='bg-red-200 shadow-lg px-[40px] py-[10px] rounded'>Hủy đơn</button>
                                      ) : order.orderStatus === "Đã hủy" ? (
                                        
                                          <button className='bg-gray-200 cursor-not-allowed px-[40px] py-[10px] rounded'>Đã hủy</button>
  
                                        
                                      ) : order.orderStatus === "Đã giao xong" ? (
                                        
                                        <button onClick={() => updateStatus(order, "Đã nhận hàng")} className='bg-[#cbf1ff] shadow-lg cursor-pointer px-[40px] py-[10px] rounded'>Nhận hàng</button>

                                      
                                    ) : order.orderStatus === "Đã nhận hàng" && order.isRefund === undefined ? (
                                        
                                      <button onClick={()=> {select(order);setTitle("Lý do trả hàng"); setShowModal(true)}}  className='bg-red-200 shadow-lg cursor-pointer px-[40px] py-[10px] rounded'>Trả hàng</button>

                                  ): order.isRefund === false ? (
                                        
                                    <></>

                                ): order.orderStatus === "Chờ xử lý" ? (
                                        
                                    <button   className='bg-gray-200 shadow-lg cursor-not-allowed px-[40px] py-[10px] rounded'>Chờ xử lý </button>

                                )  :order.orderStatus === "Đang hoàn tiền" ? (
                                        
                                  <button   className='bg-gray-200 shadow-lg cursor-not-allowed px-[40px] py-[10px] rounded'>Đang hoàn tiền </button>

                              ):order.orderStatus === "Hoàn tiền thành công" ? (
                                        
                                <></>

                            ) :(
                                        
                                          <button className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Nhận hàng</button>
  
                                        
                                      )
                                    }
                                      <button onClick={ () => {navigate(`/orderdetail/${order._id}`)}} className='bg-[#cbf1ff] shadow-lg px-[40px] py-[10px] rounded'>Xem chi tiết</button>
                                  </div>
                              </div>
          
                              
                      </div>
                    )) ) : (
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
        {
          showModal && (

          <div onClick={()=> setShowModal(false)} className={`fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/20 `}>
            <div onClick={stopPropagation} className='fixed bg-white rounded w-[50%]  top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] overflow-y-auto max-h-[90vh]'>
              <div className='flex flex-col justify-center items-center p-[10px] gap-[10px]'>
                
                  <p className='font-medium text-xl'>{title}</p>
                  {
                    title === "Lý do hủy đơn" ? (
                      <div className='w-full'> 

                        <textarea onChange={(e) => setReason(e.target.value)} className='w-full outline-none border rounded p-[5px]' name="" id="" cols="" rows="10"></textarea>
                        <div onClick={()=> {cancelHandler(order); setShowModal(false)}} className='bg-red-300 w-[30%] mx-auto flex justify-center shadow-lg rounded px-[20px] py-[10px] cursor-pointer '>
                          <p>Xác nhận hủy đơn</p>
                        </div>
                      </div>
                    ) : (
                      <div className='w-full '>

                        <textarea onChange={(e) => setReasonRefund(e.target.value)} className='w-full outline-none border rounded p-[5px]' name="" id="" cols="" rows="10"></textarea>
                        <div onClick={()=> {refundHandler(order); setShowModal(false)}} className='bg-red-300 w-[30%] mx-auto flex justify-center shadow-lg rounded px-[20px] py-[10px] cursor-pointer '>
                          <p>Xác nhận trả hàng</p>
                        </div>
                      </div>
                    )
                  }
              </div>
            </div>
          </div>
          )
        }
    </div>
  )
}

export default OrderHistory;