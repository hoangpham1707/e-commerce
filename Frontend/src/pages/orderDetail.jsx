
import { Store } from '../store';
import Hearder from '../components/header';
import Footer from '../components/footer';
import {BiChevronDown} from "react-icons/bi"
import {MdDelete} from "react-icons/md"
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {AiOutlineSetting} from "react-icons/ai";
import Axios from 'axios';
import { toast } from 'react-toastify';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import moment from 'moment';
// import { updateStatus } from '../../../Backend/Controller/OrderController';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, order: action.payload, error: '' };
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
  }

const OrderDetail = () => {

    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    // const [orderSelect, setOrderSelect] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [{ loading, error, order, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });
    
    useEffect(() => {
        const fetchOrder = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/v4/order/${orderId}/getOrderDetail`, {
              headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload : getError(err) });
          }
        };
    
        if (!userInfo) {
          return navigate('/login');
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' })
        };
        if (!order._id || (order._id && order._id !== orderId) || successDelete) {
            fetchOrder();
        }
        //   if (successDelete) {
        //     dispatch({ type: 'DELETE_RESET' });}
        //   } else {
            
        //         fetchOrder();
        //       }
        }, [order, userInfo, orderId, navigate, successDelete]);
        const formatNumberWithCommas = (number) =>  {
            return new Intl.NumberFormat('en-US').format(number);
        }
        const stopPropagation = (event) => {
            event.stopPropagation();
          };

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
            //   setOrderSelect({});
              toast.success('Hủy đơn thành công');
              dispatch({ type: 'DELETE_SUCCESS' });
            } catch (error) {
              toast.error(getError(error));
              dispatch({
                type: 'DELETE_FAIL',
              });
            }
          }
    
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
    <div className="w-full mt-[100px] bg-[#F1F5F9]">
            <Hearder/>
            <div className="w-5/6 mx-auto py-[20px]">
                {/* <div className="rounded bg-gray-400 w-full h-[50px] justify-center items-center flex">
                    <p>Order</p>
                </div>
                <div className="rounded bg-gray-400 w-full h-[50px] justify-center items-center flex">
                    <p>Order {orderId}</p>
                </div> */}
                <div className='w-full  mt-[20px] grid grid-cols-5 gap-x-[20px]'>
                    <div className='col-span-3  flex flex-col gap-y-[10px] '>
                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>Thông tin người nhận</p>
                                
                            </div>

                            <div className='mt-[10px] flex flex-col gap-y-[5px]'>
                                
                                <p>Họ tên: <span>{order.shippingAddress.fullName}</span></p>
                                <p>Email: <span>{order.shippingAddress.email}</span></p>
                                <p>Số điện thoại: <span>{order.shippingAddress.phoneNumber}</span></p>
                                <p>Địa chỉ: <span>{order.shippingAddress.address}</span></p>
                                
                            </div>
                        </div>       

                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>Phương thức thanh toán</p>
                                
                            </div>

                            <div className='mt-[10px]'>
                                <p>Phương thức: <span>{order.paymentMethod}</span></p>
                            </div>
                        </div>

                        {
                            order.reason && (

                            <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-lg font-medium'>Lý do hủy đơn</p>
                                    
                                </div>

                                <div className='mt-[10px]'>
                                    <p>Lý do: <span>{order.reason}</span></p>
                                </div>
                            </div>    
                            )
                        }

                        {
                            order.reasonRefund && order.isRefund  && (
<div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-lg font-medium'>Lý do trả hàng</p>
                                    
                                </div>

                                <div className='mt-[10px]'>
                                    <p>Lý do: <span>{order.reasonRefund}</span></p>
                                </div>
                            </div>    
                            )
                        }

                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>Sản phẩm</p>
                                
                            </div>

                            <div>
                                <ul className='flex flex-col gap-y-[10px]'>
                                    {order.orderItems.map((item,index) => (
                                        <li>
                                            <div className='grid grid-cols-4'>
                                                <div className='col-span-1'>
                                                    <img src={item.image} alt="" />
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <p>{item.name}</p>
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <p>{item.quantity}</p>
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <p>{formatNumberWithCommas(item.price)} VND</p>
                                                </div>
                                            </div>
                                                {index < order.orderItems.length -1 && <div className='border-b border-black/10 mt-[10px]'></div>}
                                        </li>

                                    ))}
                                </ul>
                            </div>
                        </div>    
                        
                    </div>
                    <div className='col-span-2   rounded border p-[10px] flex flex-col gap-y-[20px] bg-white shadow-lg'>
                        <div className='flex flex-col gap-y-[10px]'>
                            <p className='text-xl font-medium'>Mã đơn hàng: {order.orderCode}</p>
                            <p>Thời gian đặt hàng: {moment(order.createdAt).format("HH:mm-DD/MM/YYYY")}</p>
                            <p>Tình trạng đơn hàng: {order.orderStatus}</p>
                            <p>
                                Tình trạng thanh toán: {order.paymentStatus}
                            </p>
                        </div>
                        <div className=''>
                            <p className='text-lg font-medium'>Chi phí</p>
                        </div>
                        <div>
                            <ul className='flex flex-col gap-y-[10px]'>
                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p>Sản phẩm:</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p>{formatNumberWithCommas(order.itemsPrice)} VND</p>
                                    </div>
                                </li>

                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p>Vận chuyển:</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p>{formatNumberWithCommas(order.shippingPrice)} VND</p>
                                    </div>
                                </li>

                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p className=' font-semibold'>Tổng cộng:</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p className=' font-semibold'>{formatNumberWithCommas(order.totalPrice)} VND</p>
                                    </div>
                                </li>
                                
                            </ul>
                        </div>
                        {  userInfo.role === "user" && (
                            order.orderStatus === "Chờ xác nhận" || order.orderStatus === "Đang chuẩn bị đơn hàng" || order.orderStatus === "Đã chuẩn bị xong" ? (
                                <div onClick={() => setShowModal(true)} className='h-[40px] flex font-medium justify-center items-center cursor-pointer bg-red-300 shadow-lg rounded py-[10px]'>
                                    <p>Hủy đơn hàng</p>
                                </div>
                            ) : order.orderStatus === "Đã nhận hàng" ? (
                                <div className='flex flex-col gap-[10px]'>

                                    <div onClick={() => navigate(`/shopping`)} className='h-[40px] flex cursor-pointer font-medium justify-center items-center bg-[#cbf1ff] shadow-lg rounded py-[10px]'>
                                        <p >Mua lại</p>
                                    </div>

                                    <div className='h-[40px] flex font-medium justify-center items-center bg-[#cbf1ff] shadow-lg rounded py-[10px]'>
                                        <p>Trả hàng</p>
                                    </div>
                                </div>
                            ) : order.orderStatus === "Đã giao xong" ? (
                                <div onClick={() => updateStatus(order, "Đã nhận hàng")} className='h-[40px] flex font-medium justify-center items-center cursor-pointer bg-[#cbf1ff] shadow-lg rounded py-[10px]'>
                                        <p>Nhận hàng</p>
                                    </div>
                            )
                            
                            : order.orderStatus === "Đã hủy" ? (
                                <></>
                            ) : (
                                    <div className='h-[40px] flex font-medium justify-center items-center bg-gray-200 cursor-not-allowed shadow-lg rounded py-[10px]'>
                                        <p>Nhận hàng</p>
                                    </div>
                                ))
                        }
                        
                        
                    </div>
                </div>
            </div>
            <Footer/>
            {
          showModal && (

          <div onClick={()=> setShowModal(false)} className={`fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/20 `}>
            <div onClick={stopPropagation} className='fixed bg-white rounded w-[50%]  top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] overflow-y-auto max-h-[90vh]'>
              <div className='flex flex-col justify-center items-center p-[10px] gap-[10px]'>
                
                  <p className='font-medium text-xl'>Lý do hủy đơn</p>
                  <textarea onChange={(e) => setReason(e.target.value)} className='w-full outline-none border rounded p-[5px]' name="" id="" cols="" rows="10"></textarea>
                  <div onClick={()=> {cancelHandler(order); setShowModal(false)}} className='bg-red-300 shadow-lg rounded px-[20px] py-[10px] cursor-pointer '>
                    <p>Xác nhận hủy đơn</p>
                  </div>
              </div>
            </div>
          </div>
          )
        }
        </div>
    )
  )
}

export default OrderDetail;