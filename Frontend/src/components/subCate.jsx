import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const SubCate = ({ subCategories }) => {

    const productsPerRow = 4; // Number of products per row
    let [select, setSelect] = useState([]);
    const handleClick = (index1, index2) => {
        let newSelect = [index1, index2];
        setSelect(newSelect);
        // localStorage.setItem('selectedSubCategory', rows[select[1]][select[0]].label);
    }
   
    // Split products into rows
    const rows = [];
    for (let i = 0; i < subCategories.length; i += productsPerRow) {
        rows.push(subCategories.slice(i, i + productsPerRow));
    }
    // if(JSON.stringify(select) !== JSON.stringify([])){

    //     console.log(rows[select[1]][select[0]].label)
    // }
    return (
        <form className="mt-[5px]">
            <div>
                <h3 className="text-sm font-medium text-gray-900">Select</h3>
                {rows.map((subCategories, rowIndex) => (
                    <div key={rowIndex} className="flex mt-4">

                        <div className="">
                    
                            <div className="flex gap-[10px]">
                                {subCategories.map((sub,index) => (
                                    
                                    <label key={uuidv4()} onClick={() => handleClick(index, rowIndex)} className={`${ JSON.stringify(select) === JSON.stringify([index, rowIndex])  ?  "bg-[#cbf1ff] shadow-lg" : "bg-white hover:bg-[#cbf1ff] hover:shadow-lg" }  relative flex justify-center items-center px-5 py-4 rounded-md border  text-sm font-medium uppercase  focus:outline-none  cursor-pointer text-gray-900 shadow-sm`}>
                                        
                                        <span id="size-choice-1-label">{sub.label}</span>

                                        
                                    </label>

                                ))}



                                {/* <label className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-gray-900">
            <input type="radio" name="color-choice" value="Black" className="sr-only" aria-labelledby="color-choice-2-label" />
            <span id="color-choice-2-label" className="sr-only">Black</span>
            <span aria-hidden="true" className="h-8 w-8 bg-gray-900 rounded-full border border-black border-opacity-10"></span>
        </label> */}
                            </div>
                        </div>

                        
                    </div>))}
            </div>

            {/* <div className="mt-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <p href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</p>
                </div>

                <fieldset className="mt-4">
                    <legend className="sr-only">Choose a size</legend>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">

                        <label className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-not-allowed bg-gray-50 text-gray-200">
                            <input type="radio" name="size-choice" value="XXS" disabled className="sr-only" aria-labelledby="size-choice-0-label" />
                            <span id="size-choice-0-label">XXS</span>
                            <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                <svg className="absolute inset-0 h-full w-full stroke-2 text-gray-200" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                    <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </span>
                        </label>

                        <label className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                            <input type="radio" name="size-choice" value="XS" className="sr-only" aria-labelledby="size-choice-1-label" />
                            <span id="size-choice-1-label">XS</span>

                            <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                        </label>
                    </div>
                </fieldset>
            </div> */}

            
        </form>
    )
}

export default SubCate