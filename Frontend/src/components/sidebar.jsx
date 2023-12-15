import React from 'react'
import Hearder from './header';
import Footer from './footer';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../store';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SideBar = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const location = useLocation();
    const [highlightedItem, setHighlightedItem] = useState('');

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
  };
  useEffect(() => {
    const pathname = location.pathname.substring(1);
    setHighlightedItem(pathname);
    // Thêm các điều kiện xử lý cho các đường dẫn khác ở đây (nếu cần)
}, [location]);
  
//   useEffect(() => {
//     const storedItem = localStorage.getItem('highlightedItem');
//     if (storedItem) {
//         setHighlightedItem(storedItem);
//     }
// }, [location]);
 
    // const handleItemClick = (itemName) => {
    //     setHighlightedItem(itemName);
    //     // localStorage.setItem('highlightedItem', itemName);
    // };
  return (
    <div className='w-full'>
            {
                userInfo && userInfo.role ==="user" ?  (

                <div className='col-span-1 bg-white rounded shadow-lg' >
                    <ul className='flex flex-col gap-y-[10px] p-[10px]'>
                        
                            <li className={ `${highlightedItem === 'profile' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                
                                <Link to="/profile">
                                    <p className='text-xl font-medium '>Thông tin</p>

                                </Link>
                            </li>
                            <li className={ `${highlightedItem === 'orderhistory' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                <Link to="/orderhistory">
                                
                                    <p className='text-xl font-medium '>Lịch sử mua hàng</p>
                                </Link>
                            </li>
                            <li className={ `${highlightedItem === 'passwordchange' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                <Link to="/passwordchange">
                                
                                    <p className='text-xl font-medium '>Đổi mật khẩu</p>
                                </Link>
                            </li>
                            <li className=' rounded p-[10px] hover:bg-[#cbf1ff]'>
                                <Link onClick={signoutHandler} to="/">
                                
                                    <p className='text-xl font-medium '>Đăng xuất</p>
                                </Link>
                            </li>
                        
                    </ul>
                </div>
                ) : userInfo && userInfo.role === "admin" ? (
                    <div className='col-span-1 bg-white rounded shadow-lg' >
                        <ul className='flex flex-col gap-y-[10px] p-[10px]'>
                            
                                <li className={ `${highlightedItem === 'profile' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                   
                                    <Link to="/profile">
                                    
                                    <p className='text-xl font-medium'>Thông tin</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'dashboard' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="">
                                    
                                        <p className='text-xl font-medium'>Thống kê</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'categories' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/categories">
                                    
                                        <p className='text-xl font-medium'>Thể loại</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'orders' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/orders">
                                    
                                        <p className='text-xl font-medium'>Đơn hàng</p>
                                    </Link>
                                </li>

                                <li className={ `${highlightedItem === 'users' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/users">
                                    
                                        <p className='text-xl font-medium'>Người dùng</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'products' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/products">
                                    
                                        <p className='text-xl font-medium'>Sản phẩm</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'passwordchange' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                <Link to="/passwordchange">
                                
                                    <p className='text-xl font-medium '>Đổi mật khẩu</p>
                                </Link>
                            </li>

                                <li className='rounded p-[10px] hover:bg-[#cbf1ff]'>
                                    <Link onClick={signoutHandler} to="/">
                                    
                                        <p className='text-xl font-medium'>Đăng xuất</p>
                                    </Link>
                                </li>
                            
                        </ul>
                    </div>
                ) : userInfo && userInfo.role === "seller" ? (
                    <div className='col-span-1 bg-white rounded shadow-lg' >
                        <ul className='flex flex-col gap-y-[10px] p-[10px]'>
                            
                                <li className={ `${highlightedItem === 'profile' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg ' } rounded p-[10px]`} >
                                   
                                    <Link to="/profile">
                                    
                                    <p className='text-xl font-medium'>Thông tin</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'dashboard' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="">
                                    
                                        <p className='text-xl font-medium'>Thống kê</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'myproducts' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/myproducts">
                                    
                                        <p className='text-xl font-medium'>Sản phẩm của tôi</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'myorders' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                    <Link to="/myorders">
                                    
                                        <p className='text-xl font-medium'>Đơn hàng của tôi</p>
                                    </Link>
                                </li>
                                <li className={ `${highlightedItem === 'passwordchange' ? 'bg-[#cbf1ff] shadow-lg' : 'hover:bg-[#cbf1ff] hover:shadow-lg hover:shadow-lg' } rounded p-[10px]`} >
                                <Link to="/passwordchange">
                                
                                    <p className='text-xl font-medium '>Đổi mật khẩu</p>
                                </Link>
                            </li>

                                <li className='rounded p-[10px] hover:bg-[#cbf1ff]'>
                                    <Link onClick={signoutHandler} to="/">
                                    
                                        <p className='text-xl font-medium'>Đăng xuất</p>
                                    </Link>
                                </li>
                            
                        </ul>
                    </div>
                ) : (
                    <>
                    </>
                )
            }

    </div>
  )
}

export default SideBar;