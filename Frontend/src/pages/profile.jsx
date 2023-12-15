import React from 'react'
import Hearder from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';
import { useContext, useReducer, useState } from 'react';
import { Store } from '../store';
import ImageUploading from 'react-images-uploading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import SideBar from '../components/sidebar';
import { BiPlusCircle } from 'react-icons/bi'
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};


const Profile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);
  const [address, setAddress] = useState(userInfo.address);
  const [fullName, setFullName] = useState(userInfo.fullName);
  const [images, setImages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImages(file)
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };


  const inputRef = React.createRef();

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  console.log(userInfo)

  const submitHandler = async (e) => {
    e.preventDefault();
    try {

      const formData = new FormData();
      formData.append('files', images);
      const uploadResponse = await axios.post('http://localhost:4000/v4/upload', formData);

      console.log(uploadResponse.data[0])

      const newImage = uploadResponse.data[0]

      const { data } = await axios.put(
        '/v4/user/updateProfile',
        {
          fullName,
          address,
          phoneNumber,
          images: newImage,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return (
    <div className='w-full mt-[200px] bg-[#F1F5F9]'>

      <Hearder />
      <ToastContainer position="top-right" limit={1} />

      <div className='w-5/6 mx-auto py-[20px] grid grid-cols-5 gap-x-[20px]'>
        {/* <div className='col-span-1 bg-slate-300 rounded h-[200px]' >
                <ul className='flex flex-col gap-y-[10px] py-[10px]'>
                    
                        <li className='w-[95%] bg-orange-100 rounded mx-auto'>
                            <p className='text-xl font-medium p-[10px]'>Profile</p>
                        </li>
                        <li className='w-[95%]  rounded mx-auto'>
                            <Link to="/order-history">
                            
                                <p className='text-xl font-medium p-[10px]'>Order history</p>
                            </Link>
                        </li>
                        <li className='w-[95%]  rounded mx-auto'>
                            <Link onClick={signoutHandler} to="/">
                            
                                <p className='text-xl font-medium p-[10px]'>Log out</p>
                            </Link>
                        </li>
                    
                </ul>
            </div> */}
        <SideBar />
        <div className='col-span-4 bg-white rounded  p-[10px]'>
          <div>
            <p className='text-xl font-medium'>

              Thông tin tài khoản
            </p>
          </div>
          <div className='flex flex-col justify-center items-center gap-[50px] mt-[20px]'>
            <div
              className='w-[150px] h-[150px] rounded-full  flex items-center justify-center border'
              style={{ cursor: 'pointer' }}
              onClick={handleImageClick}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt='Selected'
                  className='rounded-full w-[150px] h-[150px'
                />
              ) : (
                <>
                  {userInfo.images !== "" ? (
                    <img
                      className='w-[150px] h-[150px] rounded-full'
                      src={userInfo.images}
                      alt=''
                    />
                  ) : (
                    <BiPlusCircle className='text-5xl text-black/10' />
                  )}
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {/* <ImageUploading
              multiple={false}
              value={images}
              onChange={(imageList) => { setImages(imageList) }}
            >
              {({ imageList, onImageUpload }) => (
                <div className='w-[150px] h-[150px] rounded-full  flex items-center justify-center  border' onClick={onImageUpload}>
                  {imageList.length > 0 ? (
                    <img
                      src={imageList[0].dataURL}
                      alt='Selected'
                      className='rounded-full w-[150px] h-[150px]'
                    />
                  ) : (
                    <>
                      {userInfo.images !== "" ? (
                        <img
                          className='w-[150px] h-[150px] rounded-full'
                          src={userInfo.images}
                          alt=''
                        />
                      ) : (
                        <BiPlusCircle className='text-5xl text-black/10' />
                      )}
                    </>
                  )}


                </div>
              )}
            </ImageUploading> */}

            <div className=' rounded w-[50%] grid grid-cols-7'>
              <ul className='col-span-2  flex flex-col gap-y-[20px] '>
                <li className='flex  items-center h-[36px] '>
                  Email:
                </li>

                <li className='flex  items-center h-[36px] '>
                  Name:
                </li>

                <li className='flex  items-center h-[36px] '>
                  Số điện thoại:
                </li>
                <li className='flex  items-center h-[36px] '>
                  Địa chỉ:
                </li>
              </ul>

              <ul className='col-span-5 flex flex-col gap-y-[20px]'>
                <li className=''>
                  <input disabled type="email" value={userInfo.email} className='outline-none bg-gray-200 cursor-not-allowed w-full border rounded h-[36px] px-[10px]' />
                </li>

                <li>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className='outline-none w-full border rounded h-[36px] px-[10px]' />
                </li>
                <li>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='outline-none w-full border rounded h-[36px] px-[10px]' />
                </li>

                <li>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className='outline-none w-full border rounded h-[36px] px-[10px]' />
                </li>
              </ul>
            </div>

            <div className='rounded w-[50%] bg-gray-300 flex justify-center items-center py-[10px]'>
              <button onClick={submitHandler}>Cập nhật</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile;