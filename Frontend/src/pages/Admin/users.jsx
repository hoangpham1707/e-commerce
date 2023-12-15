import React, { useState } from 'react'
import Hearder from '../../components/header';
import Footer from '../../components/footer';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import { getError } from '../../utils';
import axios from 'axios';
import {BiEdit} from 'react-icons/bi'
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import SideBar from '../../components/sidebar';
import {MdDelete} from 'react-icons/md'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Pagination from '../../components/pagination';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload.users,
        pages: action.payload.pages,
        loading: false,
      };
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



const Users = () => {
  const [{ loading, error, users,pages,  loadingDelete, successDelete  }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(queryParams.get('page') || 1);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/v4/user/getAllUser?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: {users: data.users, pages:data.pages} });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, currentPage]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/v4/user/${user._id}/deleteUser`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  const handlePageChange = (newPage) => {
    // localStorage.setItem('shoppingCurrentPage', newPage.toString());
    setCurrentPage(newPage);
    // console.log(newPage)
};
  
  return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        <Hearder/>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
            
            <SideBar/>
            <div className='col-span-4 border rounded bg-white  p-[10px] shadow-lg'>
                <p className='text-2xl font-medium'>Danh sách người dùng</p>
                {
                  loading ? ( 
                    <LoadingBox />
                  ) : error ? (
                    <MessageBox>{error}</MessageBox>
                  ) : (
                // <div className='w-full  text-lg font-semibold flex flex-col mt-[10px] gap-y-[10px]'>
                 
                // </div>
                <div className="">
  
                  <div className="overflow-y-hidden rounded border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-300 text-left text-xs font-semibold uppercase tracking-widest ">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Họ tên</th>
                            <th className="px-5 py-3">Chức vụ</th>
                            <th className="px-5 py-3">Ngày tạo</th>
                            <th className="px-5 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-500">
                          {
                            users.map((user,index) => (
                              <tr className={`${index === users.length-1 ? "" : "border-b" }`}>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <p className="whitespace-no-wrap">{user._id}</p>
                            </td>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-full w-full rounded-full" src={user.images} alt="" />
                                </div>
                                <div className="ml-3">
                                  <p className="whitespace-no-wrap">{user.fullName}</p>
                                </div>
                              </div>
                            </td>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <p className="whitespace-no-wrap">{user.role}</p>
                            </td>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <p className="whitespace-no-wrap">Sep 28, 2022</p>
                            </td>

                            <td className=" flex gap-x-[5px] border-gray-200 bg-white px-5 py-5 text-sm">
                              <button>

                                <BiEdit className=' text-2xl'/>
                              </button>
                              <button onClick={() => deleteHandler(user)}>

                                <MdDelete className='text-red-300 text-2xl'/>
                              </button>
                              
                            </td>
                          </tr>
                            ))
                          }
                          
                        </tbody>
                      </table>
                    </div>
                    
                  </div>
                </div>

                


                  )
                }

                <div className='mt-[20px] flex justify-center items-center'>
                
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pages}
                        onPageChange={handlePageChange}
                        number = {localStorage.getItem('shoppingCurrentPage')}
                    />

                </div>
                
                
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Users;