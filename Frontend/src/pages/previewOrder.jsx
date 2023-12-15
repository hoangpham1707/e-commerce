
import { Store } from '../store';
import Hearder from '../components/header';
import Footer from '../components/footer';
import {BiChevronDown} from "react-icons/bi"
import {MdDelete} from "react-icons/md"
import { Link, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {AiOutlineSetting} from "react-icons/ai";
import Axios from 'axios';
import { toast } from 'react-toastify';
// import { getError } from '../utils';
import React, { useContext, useEffect, useReducer } from 'react';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
const reducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_REQUEST':
        return { ...state, loading: true };
      case 'CREATE_SUCCESS':
        return { ...state, loading: false };
      case 'CREATE_FAIL':
        return { ...state, loading: false };
      default:
        return state;
    }
  };

const PreviewOrder = () => {
    const date = new Date();

    const navigate = useNavigate();
    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
      });
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    
    // const number = localStorage.setItem('number', 20);

    const checkedItems = cart.cartItems.filter(item => item.isChecked);

    const formatNumberWithCommas = (number) =>  {
        return new Intl.NumberFormat('en-US').format(number);
    }

    

    const quantitySellerIds = new Set(checkedItems.map(item => item.sellerId));
    

    
    
    cart.itemsPrice = checkedItems.reduce((a, c) => a + c.quantity * c.price, 0);
    cart.shippingPrice = cart.itemsPrice > 10000000 ? 0 : (30000 * quantitySellerIds.size);
    
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

    
    // console.log(cart)
    const placeOrderHandler = async () => {
      try {
          
        dispatch({ type: 'CREATE_REQUEST' });
  
        const { data } = await Axios.post('/v4/order/createOrder',
          {
            orderItems: checkedItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice,
            orderCode: moment(date).format('YYYYMMDDHHmmss'),
            paymentStatus : "Chưa thanh toán"
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        // console.log(data)
        const result = await Axios.post('v4/order/orderSplit',
          {
            orderCode : data.orderCode,
            orderItems: data.orderItems,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
            shippingPrice: data.shippingPrice,
            orderId: data._id,
            paymentStatus: data.paymentStatus,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        ctxDispatch({ type: 'CART_CLEAR' });
        dispatch({ type: 'CREATE_SUCCESS' });
        localStorage.removeItem('cartItems');
        navigate(`/ordersuccess/${data._id}`);                
   
      } catch (err) {
        dispatch({ type: 'CREATE_FAIL' });
        toast.error(getError(err));
      }
    };

      
      

    const VTCPayHandler = async () => {
        try {
          
            dispatch({ type: 'CREATE_REQUEST' });
      
            const { data } = await Axios.post('/v4/order/createOrder',
              {
                orderItems: checkedItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                totalPrice: cart.totalPrice,
                orderCode: moment(date).format('YYYYMMDDHHmmss'),
                paymentStatus: "Chờ thanh toán"
              },
              {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            );
            const response = await Axios.post('v4/order/orderSplit',
            {
                orderCode : data.orderCode,
                orderItems: data.orderItems,
                shippingAddress: data.shippingAddress,
                paymentMethod: data.paymentMethod,
                shippingPrice: data.shippingPrice,
                orderId: data._id,
                paymentStatus: data.paymentStatus,
            },
            {
                headers: {
                authorization: `Bearer ${userInfo.token}`,
                },
            }
            );
            
            const result = await Axios.post('v4/vtcpay/toPaymentGateway',
              {
                amount : data.totalPrice,
                reference_number : data.orderCode,
              }
            );

            // console.log(result)
            window.location.href = result.data;
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });

                           
       
          } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
          }
    
    //   try {
    //     const response = await Axios.post('/v4/vtcpay/toPaymentGateway', {
    //       amount: cart.totalPrice,
    //       reference_number : moment(date).format('YYYYMMDDHHmmss')

    //     });
        
    //   } catch (error) {
    //     console.error('Error creating payment URL:', error);
    //   }
    
    
    };

      
      

      
    

    useEffect(() => {
        if (!cart.paymentMethod) {
        navigate('/paymentmethod');
        }
    }, [cart, navigate]);

    
    
  return (
    <div className="w-full mt-[100px] bg-[#F1F5F9]">
            <Hearder/>
            <div className="w-5/6 mx-auto py-[20px]">
                {/* <div className="rounded bg-gray-400 w-full h-[50px] justify-center items-center flex">
                    <p>Preview Order</p>
                </div> */}
                <div className='w-full  mt-[20px] grid grid-cols-6 gap-x-[20px]'>
                    <div className='col-span-4  flex flex-col gap-y-[10px] '>
                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between '>
                                <p className='text-lg font-medium'>Thông tin người nhận</p>
                                <Link to="/shipping">
                                
                                    <AiOutlineSetting className='font-medium text-xl'/>
                                </Link>
                            </div>

                            <div className='mt-[10px] flex flex-col gap-y-[5px]'>
                                
                                <p>Họ tên: <span>{cart.shippingAddress.fullName}</span></p>
                                <p>Email: <span>{cart.shippingAddress.email}</span></p>
                                <p>Số điện thoại: <span>{cart.shippingAddress.phoneNumber}</span></p>
                                <p>Địa chỉ: <span>{cart.shippingAddress.address}</span></p>
                                
                            </div>
                        </div>       

                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>Phương thức thanh toán</p>
                                <Link to="/paymentmethod">
                                
                                    <AiOutlineSetting className='font-medium text-xl'/>
                                </Link>
                            </div>

                            <div className='mt-[10px]'>
                                <p>Phương thức: <span>{cart.paymentMethod}</span></p>
                            </div>
                        </div>

                        <div className='w-full  rounded border p-[10px] bg-white shadow-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-medium'>Sản phẩm</p>
                                <Link to="/cart">
                                
                                    <AiOutlineSetting className='font-medium text-xl'/>
                                </Link>
                            </div>

                            <div>
                                <ul className='flex flex-col gap-y-[10px]'>
                                    {checkedItems.map((item, index) => (
                                        <li>
                                            <div className='grid grid-cols-4'>
                                                <div className='col-span-1 '>
                                                    <Link to={`/product/${item._id}`}>
                                                    
                                                        <img className='object-contain w-[150px] h-[150px]' src={item.images} alt="" />
                                                    </Link>
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <Link to={`/product/${item._id}`}>
                                                    
                                                        <p className='font-medium'>{item.name}</p>
                                                    </Link>
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <p>{item.quantity}</p>
                                                </div>

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <p>{formatNumberWithCommas(item.price)}</p>
                                                </div>
                                            </div>
                                            {index < cart.cartItems.length - 1 && <div className='border-b border-black/10 mt-[10px]'></div>}
                                        </li>

                                    ))}
                                </ul>
                            </div>
                        </div>        
                    </div>
                    <div className='col-span-2 h-[230px] relative   rounded border p-[10px] flex flex-col gap-y-[20px] bg-white shadow-lg'>
                        <div className=''>
                            <p className='text-lg font-medium'>Phí thanh toán</p>
                        </div>
                        <div>
                            <ul className='flex flex-col gap-y-[10px]'>
                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p>Sản phẩm</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p>{formatNumberWithCommas(cart.itemsPrice)} VND</p>
                                    </div>
                                </li>

                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p>Vận chuyển</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p>{formatNumberWithCommas(cart.shippingPrice)} VND </p>
                                    </div>
                                </li>

                                <li className='grid grid-cols-2'>
                                    <div className='col-span-1'>
                                        <p className=' font-semibold'>Tổng cộng</p>
                                    </div>
                                    <div className='col-span-1'>
                                        <p className=' font-semibold'>{formatNumberWithCommas(cart.totalPrice)} VND</p>
                                    </div>
                                </li>
                                
                            </ul>
                        </div>
                        <div className='w-full h-[40px] rounded shadow-lg bg-[#cbf1ff] flex justify-center items-center mx-auto'>
                            {
                                cart.paymentMethod === 'Thanh toán tiền mặt khi nhận hàng' ?
                                (
                                    <button type='button' onClick={placeOrderHandler}>
                                        Xác nhận đặt hàng
                                    </button>
                                ) : (
                                    <button type='button' onClick={VTCPayHandler} >
                                        Xác nhận đặt hàng
                                    </button>
                                )
                            }
                        </div>
                        {loading && <div className='absolute top-[68%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'><LoadingBox/></div>}

                        {/* <div className='w-full h-[40px] rounded bg-gray-200 flex justify-center items-center mx-auto'>
                            
                                
                               
                                    <button>
                                        test vtcpay
                                    </button>
                                
                                    
                                
                            
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
  )
}

export default PreviewOrder;