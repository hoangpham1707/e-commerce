import React, { useContext, useEffect, useReducer, useState } from 'react'
import Pagination from './pagination';
import moment from 'moment';
import { AiFillStar, AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { Store } from '../store';
import { BiPlusCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { getError } from '../utils';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
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
        default:
            return state;
    }
};

const Comment = (props) => {
    const { comments, id } = props.data;
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    // console.log(id)
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const [{ loading, error, order }, dispatch] = useReducer(logger(reducer), {

        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            // const result = await axios.get('/api/products');
            // setProducts(result.data);
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/v4/order/${id}/orderComment`,
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    });
                // setProducts(response.data.products);

                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                console.log(data)
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [id]);

    const stopPropagation = (event) => {
        event.stopPropagation();
    };
    console.log(userInfo._id)
    let index = 0;
    for (const comment of currentComments) {
        if (comment.userId === userInfo._id) {
            // setEditComment(comment.comment);
            index++;
        }
    }

    const [queryText, setQueryText] = useState('');
    const [rating, setRating] = useState('');

    const handleChangeQuery = (e) => setQueryText(e.target.value);
    const handleChangeRating = (e) => setRating(e.target.value);

    console.log(queryText)

    const [images, setImages] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleImageClickEdit = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const inputRef = React.createRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImages(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('image', images);
            formData.append('phrase', queryText)

            //xử lý ảnh
            const response = await axios.post(
                'http://localhost:4000/v4/upload/process-comment',
                formData,
            );
            console.log('response:', response.data);
            // console.log(queryText);

            if (response.data.predicted_label === "ảnh phù hợp" && response.data.result === "Hợp lệ!") {
                alert('Đang xử lý');
                // If the image processing is successful, then post the product separately
                createCommentHandler(); // Pass the formData with the image to postProduct
            } else {
                alert('Hình ảnh không phù hợp thể loại!!!');
                setSelectedImage(null)
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const [editRating, setEditRating] = useState(''); // Giá trị ban đầu của editRating là chuỗi trống
    const [editComment, setEditComment] = useState(''); // Giá trị ban đầu của editComment là chuỗi trống
    const updatedComments = [...currentComments];

    for (let i = 0; i < updatedComments.length; i++) {
        if (updatedComments[i].userId === userInfo.id) {
            // Tìm thấy bình luận của bạn, cập nhật các giá trị cần thiết (ví dụ: rating và comment)
            console.log(updatedComments[i].rating)
            setEditRating(updatedComments[i].rating); // Cập nhật editRating nếu tìm thấy
            setEditComment(updatedComments[i].comment); // Cập nhật editComment nếu tìm thấy
            break; // Đã tìm thấy và cập nhật, thoát khỏi vòng lặp
        }
    }

    const createCommentHandler = async () => {
        try {
            dispatch({ type: 'DELETE_REQUEST' });

            const formData = new FormData();
            formData.append('files', images);


            const uploadResponse = await axios.post('http://localhost:4000/v4/upload', formData);

            const newImage = uploadResponse.data[0]

            const result = await axios.post(`/v4/product/${id}/reviews`,
                {
                    rating: rating,
                    comment: queryText,
                    images: newImage,
                }, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            }
            );
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('Create Review successfully');
            setShowModal(false);
            setSelectedImage(null)
        } catch (error) {
            toast.error(getError(error))
            dispatch({
                type: 'DELETE_FAIL',
            });

        }
    }


    return (
        <div>
            <section id='comment' className="bg-white dark:bg-gray-900 py-8 lg:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Đánh giá sản phẩm</h2>
                        {
                            order && index === 0 && (
                                <h2 onClick={() => { setShowModal(true); setTitle("Đánh giá") }} className="text-lg bg-[#cbf1ff] shadow-lg rounded-3xl  font-bold text-gray-900 px-[10px] py-[5px] cursor-pointer">Đánh giá
                                </h2>
                            )
                        }
                    </div>

                    {currentComments.map((comment) => (
                        <article key={comment._id} className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"><img
                                        className="mr-2 w-8 h-8 rounded-full"
                                        src={comment.userImage}
                                        alt="Helene Engels" />{comment.userName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate="true" dateTime="2022-06-23"
                                        title="June 23rd, 2022">{moment(comment.created_at).format("DD- MM-YYYY")}</time></p>
                                </div>
                                {
                                    comment.userId === userInfo._id ? (

                                        <button onClick={() => { setShowModal(true); setTitle("Chỉnh sửa đánh giá") }} id="dropdownComment4Button" data-dropdown-toggle="dropdownComment4"
                                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                            type="button">
                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                                                </path>
                                            </svg>
                                        </button>
                                    ) : (
                                        <></>
                                    )
                                }
                                <div id="dropdownComment4"
                                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownMenuIconHorizontalButton">
                                        <li>
                                            <a href="#"
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                        </li>
                                    </ul>
                                </div>
                            </footer>
                            <div className="flex items-center">
                                <p className="text text-gray-600 dark:text-gray-400"><time pubdate="true" dateTime="2022-06-23"
                                    title="June 23rd, 2022">Điểm số: {comment.rating}  </time></p>
                                <AiFillStar className="text-yellow-200" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">{comment.comment}</p>
                            <div className="flex items-center mt-4 space-x-4">
                                {/* <button type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                                    <svg aria-hidden="true" className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                    Reply
                                </button> */}
                            </div>
                        </article>


                    ))}

                    <div className="flex justify-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(comments.length / commentsPerPage)}
                            onPageChange={setCurrentPage}
                            hasComments={comments.length > 0}
                        />
                    </div>
                </div>
            </section>

            {
                showModal && (

                    <div onClick={() => setShowModal(false)} className={`fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/20 `}>
                        <div onClick={stopPropagation} className='fixed bg-white rounded w-[40%]  top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] overflow-y-auto max-h-[90vh]'>
                            <div className='flex flex-col justify-center items-center p-[10px] gap-[10px]'>

                                <p className='font-medium text-xl'>{title}</p>
                                {
                                    title === "Đánh giá" ? (
                                        <div className='w-2/3'>
                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Điểm số</label>
                                                <input
                                                    className='p-[10px] outline-none border rounded'
                                                    placeholder=''
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={rating}
                                                    onChange={handleChangeRating}
                                                />
                                            </div>

                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Đánh giá</label>
                                                <textarea
                                                    className='w-full outline-none border rounded p-[5px]'
                                                    name=""
                                                    id=""
                                                    cols=""
                                                    rows="5"
                                                    value={queryText}
                                                    onChange={handleChangeQuery}
                                                >
                                                </textarea>

                                            </div>
                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Ảnh</label>
                                                <div className='flex gap-[20px]'>
                                                    <div className='h-[100px] w-[100px] flex justify-center items-center bg-gray-100 border border-black/50 border-dashed '
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={handleImageClick}
                                                    >
                                                        {selectedImage ? (
                                                            <img
                                                                src={selectedImage}
                                                                alt='Selected'
                                                                className='w-[150px] h-[150px'
                                                            />
                                                        ) : (
                                                            <BiPlusCircle className='text-5xl text-black/10' />
                                                        )}
                                                    </div>
                                                    <input
                                                        ref={inputRef}
                                                        type='file'
                                                        accept='image/*'
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    ) : (
                                        <div className=''>
                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Điểm số</label>
                                                <input
                                                    className='p-[10px] outline-none border rounded'
                                                    placeholder=''
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={editRating}
                                                    onChange={(e) => setEditRating(e.target.value)}
                                                />
                                            </div>

                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Đánh giá</label>
                                                <textarea
                                                    className='w-full outline-none border rounded p-[5px]'
                                                    name=""
                                                    id=""
                                                    cols=""
                                                    rows="5"
                                                    value={editComment}
                                                    onChange={(e) => setEditComment(e.target.value)}
                                                >

                                                </textarea>

                                            </div>
                                            <div className='flex flex-col w-full'>
                                                <label className='text-sm font-medium' htmlFor="">Ảnh</label>
                                                <div className='flex gap-[20px]'>
                                                    <div className='h-[100px] w-[100px] flex justify-center items-center bg-gray-100 border border-black/50 border-dashed '>
                                                        <AiOutlinePlus className='opacity-50 text-2xl' />
                                                    </div>

                                                    <div className='h-[100px] w-[100px] flex justify-center items-center bg-gray-100 border border-black/50 border-dashed '>
                                                        <AiOutlinePlus className='opacity-50 text-2xl' />
                                                    </div>

                                                    <div className='h-[100px] w-[100px] flex justify-center items-center bg-gray-100 border border-black/50 border-dashed '>
                                                        <AiOutlinePlus className='opacity-50 text-2xl' />
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className='bg-[#cbf1ff] shadow-lg rounded px-[20px] py-[10px] cursor-pointer '>
                                    <button onClick={() => { handleUpload() }} type='submit'>
                                        <p>Hoàn tất</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Comment;