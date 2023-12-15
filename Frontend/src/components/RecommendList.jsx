import React from 'react';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { BiCartAlt } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import FormatDes from './formatDes';

const RecommendList = ({ products }) => {
    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    function formatNumberWithCommas(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    console.log(products)

    const productsPerRow = 5; // Number of products per row

    return (
        <div className="overflow-x-auto bg-white border p-[10px] rounded shadow-lg"> {/* Scrollable container */}
            <div className="flex mt-4">
                {products.map((product) => (
                    <div key={product._id} className="bg-white border p-[10px] rounded shadow-lg hover:-translate-y-2 transition-transform duration-300">
                        <div className="flex justify-center items-center rounded mx-auto object-cover">
                            <Link to={`/product/${product._id}`}>
                                <div className="  flex justify-center items-center  rounded mx-auto object-cover">
                                    <img className=" object-contain h-[300px]" src={product.images} alt="" />
                                </div>
                                <div className="flex mt-[10px]  justify-between  font-medium">
                                    <p className="h-14">{truncateDescription(product.name, 46)}</p>
                                    {
                                        product.name.length <= 28 && <br />
                                    }


                                </div>

                                <div className="flex items-center  justify-between  my-[5px]">
                                    <div className="flex items-center gap-[5px] ">
                                        <p className="font-medium text-sm">{product.rate}</p>
                                        <AiFillStar className="text-yellow-300 " />

                                    </div>

                                    <div className="flex gap-[5px]">
                                        <p className="text-sm font-medium">Đã bán</p>
                                        <p className="text-sm font-medium">{product.numberOfReviews}</p>
                                    </div>
                                </div>
                                <div className="flex items-center w-[250px] mx-auto justify-between">
                                    <p className="font-semibold text-xl">{formatNumberWithCommas(product.price)}</p>
                                    <div className="flex justify-center items-center border rounded-md p-[5px] mb-[15px]">
                                        <p>Buy now</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendList;
