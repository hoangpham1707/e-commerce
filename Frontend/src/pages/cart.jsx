import React, { useEffect } from 'react'
import { useContext } from 'react';
import { Store } from '../store';
import Hearder from '../components/header';
import Footer from '../components/footer';
import {BiChevronDown, BiLinkAlt} from "react-icons/bi"
import {MdDelete} from "react-icons/md"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Empty } from '../empty-cart.svg';
import axios from 'axios';
const Cart = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems, shippingAddress },
        
    } = state;
    // console.log(cartItems)
    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/v4/product/${item._id}/getProductById`);
        if (data.quantity < quantity) {
          window.alert('Sản phẩm đã hết');
          return;
        }
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
      };
      const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      };
    
      const checkoutHandler = () => {
        if(shippingAddress === {} ) {
            navigate('/signin?redirect=/shipping');
            
        }else{
            navigate('/placeorder')
            
        }

      };
      const toggleItemCheckHandler = (productId) => {
        ctxDispatch({ type: 'CART_ITEM_CHECK', payload: { productId } });
      };
      const toggleAllItemsHandler = () => {
        ctxDispatch({ type: 'CART_ALLITEMS_CHECK' });
      };

      useEffect(() => {
        // Reset trạng thái isChecked khi component Cart được render lại
        ctxDispatch({ type: 'CART_RESET_ITEMS_CHECK' });
      }, [ctxDispatch]);
    
      const formatNumberWithCommas = (number) =>  {
        return new Intl.NumberFormat('en-US').format(number);
    }
    

  return (
    <div className="w-full mt-[100px] bg-[#F1F5F9]">
            <Hearder/>
            <div className="w-5/6 mx-auto py-[20px]">
                
                <div className=''>

                    {
                        cartItems.length === 0 ? (

                            <div className=' flex justify-center items-center flex-col '>
                                <Empty className="w-[500px] h-[400px]"/>
                                <div className=' flex flex-col gap-[20px] '>

                                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                                    <div className='w-[300px] bg-[#cbf1ff] flex justify-center items-center py-[10px] rounded'>
                                        <Link to="/" className=' '>Tiếp tục mua sắm</Link>
                                    </div>
                                </div>
                            </div>
                            // <p>
                            //     cart is empty. <Link to="/">Go Shopping</Link>  
                            // </p>
                        ) : (
                            
                            <div className='w-full  mt-[20px] grid grid-cols-6 gap-x-[20px]'>
                                <div className='col-span-4 flex flex-col gap-y-[10px]  rounded  '>
                                    <div className="">
                                        <ul className='items-center flex grid grid-cols-7 rounded bg-white shadow-lg w-full h-[50px] p-[5px]'>
                                            <li className='flex items-center gap-x-[5px] col-span-3 '>
                                                <input checked={cartItems.every(item => item.isChecked)} onChange={toggleAllItemsHandler} type="checkbox" className='w-[20px] h-[20px]' />
                                                <p>Tất cả ({cartItems.length} sản phẩm)</p>  


                                            </li>
                                            <li className='col-span-1 flex justify-center'>
                                                <p>Giá</p>
                                            </li>

                                            <li className='col-span-1 flex justify-center'>
                                                <p>Số lượng</p>

                                            </li>

                                            <li className='col-span-1 flex justify-center'>
                                                <p >
                                                    Thành tiền
                                                </p>

                                            </li>

                                            <li className='col-span-1'>
                                                
                                            </li>


                                        </ul>
                                    
                                    </div>
                                    {/* <ul className='w-full grid grid-cols-12 gap-[10px] '>
                                        <li className='col-span-3'>
                                            <div className='w-[95%] mx-auto'>
                                                <p>Image</p>
                                            </div>
                                        </li>
                                        <li className='col-span-4'>
                                            Details
                                        </li>
                                        <li className='col-span-2 flex justify-center'>
                                            Qty
                                        </li>
                                        <li className='col-span-2 flex justify-center'>
                                            Price
                                        </li>
                                        <li className='col-span-1 flex justify-center'>
                                            Icon
                                        </li>
                                    </ul> */}
                                    {
                                        cartItems.map((item) => (
                                            <div key={item._id}>
                                                
                                                <ul className='w-full grid grid-cols-7  p-[5px] bg-white shadow-lg rounded'>
                                                    <div className='col-span-3 flex items-center gap-[5px]'>
                                                        <li>
                                                            <input checked={item.isChecked} onChange={() => toggleItemCheckHandler(item._id)}  type="checkbox" className='w-[20px] h-[20px]'/>
                                                        </li>
                                                        <li className=' items-center'>
                                                            <div className='w-[150px] h-[150px]'>
                                                                <Link to={`/product/${item._id}`}>
                                                                
                                                                    <img  className='object-contain w-[150px] h-[150px]' src={item.images} alt="" />
                                                                </Link>
                                                            </div>
                                                        </li>
                                                        <li className=' flex flex-col justify-center'>
                                                            <Link to={`/product/${item._id}`}>
                                                                <p className='font-medium'>{item.name}</p>
                                                            
                                                            </Link>
                                                            <p>Thể loại: {item.category}</p>
                                                            
                                                        </li>
                                                    </div>
                                                    <li className='col-span-1 flex justify-center items-center'>
                                                        {formatNumberWithCommas(item.price)}
                                                    </li>
                                                    <li className='col-span-1 flex justify-center items-center'>
                                                        <div className='w-[70px] h-[50px] rounded bg-gray-100 flex items-center justify-center gap-x-[10px]'>
                                                            <p className='text-xl font-medium'>{item.quantity}</p>
                                                            <div className='flex flex-col'>
                                                                <button onClick={() => updateCartHandler(item, item.quantity + 1)} 
                                                                    className={`${item.quantity === 100 ? 'text-gray-100 cursor-not-allowed' : 'text-black' }`}
                                                                    disabled={item.quantity === 100}
                                                                >
                                                                    <BiChevronDown className='rotate-180 '/>
                                                                    
                                                                </button>
                                                                <button  onClick={() => updateCartHandler(item, item.quantity - 1)}
                                                                    className={`${item.quantity === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black' }`}
                                                                    disabled={item.quantity === 1}
                                                                >
                                                                    <BiChevronDown />
                                                                    
                                                                </button>

                        

                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className='col-span-1 flex justify-center items-center'>
                                                        {formatNumberWithCommas(item.price*item.quantity)}
                                                    </li>
                                                    <li className='col-span-1 flex justify-center items-center'>
                                                        <button onClick={() => removeItemHandler(item)}>
                                                            <MdDelete className='text-red-300 text-2xl'/>
                                                        </button>
                                                    </li>
                                                </ul>
                                                
                                            </div>
                                        ))
                                    }
                                    
                                </div>

                                <div className='col-span-2 bg-white shadow-lg h-[110px] rounded border p-[10px]'>
                                    <div className=''>
                                        <div className='flex items-center gap-[5px]'>
                                             <p className='font-medium text-lg'>Tổng cộng:</p>
                                            <p className='text-lg'>
                                                {formatNumberWithCommas(cartItems.reduce((a, c) => a + c.price * c.quantity, 0))} VND
                                            
                                            </p>
                                        </div>
                                    </div>
                                    <div onClick={checkoutHandler} className=' cursor-pointer h-[50px] shadow-lg rounded bg-[#cbf1ff] mt-[10px] flex justify-center items-center '>
                                        <button className='font-medium'>
                                            Mua hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Footer/>
        </div>
  )
}

export default Cart;