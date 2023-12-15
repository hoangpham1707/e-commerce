import React, { useState } from 'react'
import Hearder from '../../components/header';
import Footer from '../../components/footer';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import { getError } from '../../utils';
import axios from 'axios';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import SideBar from '../../components/sidebar';
import {MdDelete} from 'react-icons/md'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Pagination from '../../components/pagination';
import moment from 'moment';
import {BiEdit, BiPlusCircle} from 'react-icons/bi'
const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, 
          categories: action.payload,
          loading: false };
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


const Categories = () => {
    const [{ loading, error, categories,loadingDelete, successDelete }, dispatch] = useReducer((reducer), {
        
        loading: true,
        error: '',
    });

    
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [title, setTitle] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [category, setCategory] = useState({});
    // const [category, setCategory] = useState({})
//   const [categoryToEdit, setCategoryToEdit] = useState(null);
    // const [hidden, setHidden] = useState(false)
    
    // const HandleClick = () => {
    //     setHidden(true)
    // }
    // console.log(userInfo)
    useEffect(() => {
        const fetchData = async () => {
        // const result = await axios.get('/api/products');
        // setProducts(result.data);
        try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get("/v4/categories/getAllCategories", {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              });
            //   console.log(data)
            
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: err.message });
        }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
          } else {
            fetchData();
          }
        }, [userInfo, successDelete]);

  const createCategory = async () => {
    try{
      dispatch({ type: 'DELETE_REQUEST' });
      const {data} = await axios.post("/v4/categories/createCategory", {
        title},
        {
        
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      toast.success('Create category successfully');
      dispatch({ type: 'DELETE_SUCCESS' });
      setTitle("");
    }catch(error){
      toast.error(getError(error));
      dispatch({
        type: 'DELETE_FAIL',
      });

    }
  }
  
  
  const editCategory = async (category) => {
    // console.log(id)
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.put(`/v4/categories/${category._id}/updateCategory`, 
          {title : editTitle},
        
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          
        });
        // setCategory({})
        toast.success('Category Edit successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
        
        setCategory({})
        console.log(category)
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    };
  // console.log(category)
  const select = async(category) => {
    setCategory(category)
    setEditTitle(category.title)
    
  }
  // console.log(category)
  

  const deleteHandler = async (category) => {
    // console.log(category)
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/v4/categories/${category._id}/deleteCategory`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Category deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  const stopPropagation = (event) => {
    event.stopPropagation();
  };
  
  return (
    <div className='w-full mt-[100px] bg-[#F1F5F9]'>
        <Hearder/>
        <ToastContainer position="top-right" limit={1} />

        <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
            
            <SideBar/>
            <div className='col-span-4 border rounded bg-white  p-[10px] shadow-lg'>
                <div className='flex justify-between items-center'>

                    <p className='text-2xl font-medium'>Danh sách thể loại</p>
                    <div onClick={() => {setShowModal(true); setName('Tạo thể loại')}} className=' bg-[#cbf1ff] shadow-lg cursor-pointer flex items-center rounded gap-x-[5px] px-[10px] py-[5px]'>
                        <BiPlusCircle className='text-xl'/>
                        <p className='text-xl font-medium'>Tạo mới</p>
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
                // <div className='w-full  text-lg font-semibold flex flex-col mt-[10px] gap-y-[10px]'>
                 
                // </div>
                <div className="mt-[5px]">
  
                  <div className="overflow-y-hidden rounded border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-300 text-left text-xs font-semibold uppercase tracking-widest ">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Tên thể loại</th>
                            {/* <th className="px-5 py-3">Seller</th> */}
                            <th className="px-5 py-3">Ngày tạo</th>
                            <th className="px-5 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-500">
                          {
                            categories.map((category,index) => (
                              <tr className={`${index === categories.length-1 ? "" : "border-b" }`}>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <p className="whitespace-no-wrap">{category._id}</p>
                            </td>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <div className="flex items-center">
                                {/* <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-full w-full rounded-full" src={product.images} alt="" />
                                </div> */}
                                <div className="ml-3">
                                  <p className="whitespace-no-wrap">{category.title}</p>
                                </div>
                              </div>
                            </td>
                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                              <p className="whitespace-no-wrap">{moment(category.createdAt).format('DD/MM/YYYY')}</p>
                            </td>
                            

                            <td className=" border-gray-200 bg-white px-5 py-5 text-sm">
                                <button onClick={() => {setShowModal(true); setName('Chỉnh sửa thể loại'); select(category)}}>

                                <BiEdit className=' text-2xl'/>
                              </button>
                              <button onClick={() => deleteHandler(category)}>

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
                
                
            </div>
        </div>
        <Footer/>
        {
          showModal && (

        <div onClick={()=> {setShowModal(false); setName("")}} className='fixed z-10 top-0 right-0 bottom-0 left-0 bg-gray-300/50 '>
          <div onClick={stopPropagation} className='fixed flex flex-col justify-center items-center gap-[10px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white  rounded px-[50px] py-[20px]'>
            <p className='font-medium text-xl'>{name}</p>
            {
              name === "Tạo thể loại" ? (
                <div className='flex flex-col justify-center items-center gap-[20px]'>

                  <div>
                    <input onChange={(e) => setTitle(e.target.value)} className='p-[10px] outline-none border rounded' placeholder='Category Name' type="text" />
                  </div>
                  <div>
                    <button onClick={() => {createCategory(); setShowModal(false);}} className='bg-[#cbf1ff] shadow-lg rounded px-[20px] py-[10px]'>
                      Hoàn tất
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center gap-[20px]'>
                  <div>
                    <input onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className='p-[10px] outline-none border rounded' placeholder='Category Name' type="text" />
                  </div>
                  <div>
                    <button  onClick={() => {editCategory(category); setShowModal(false)}}  className='bg-[#cbf1ff] shadow-lg rounded px-[20px] py-[10px]'>
                      Hoàn tất
                    </button>
                  </div>
                
                </div>
              )
            }
          </div>
        </div>
          )
        }

        
    </div>
  )
}

export default Categories;