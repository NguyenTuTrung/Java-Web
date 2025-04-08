import React from 'react';
import { Link } from "react-router-dom";

type LinkEntity = {
    name: string;
    url: string;
};
const Details = ({
    links,
    label,
}: {
    links: LinkEntity[];
    label: string;
}) => {
    return (
        <div className='px-2'>

            <div className="group relative ">

                <div className="flex items-center justify-between  bg-gradient-to-r from-[#1E5B53] to-[#CCFFAA] text-white font-bold rounded-2xl transition-transform transform-gpu hover:-translate-y-1 hover:rounded-b-xl   ">
                    <a className="menu-hover my-2 py-2 text-base font-medium text-white lg:mx-4" >
                        {label}
                    </a>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </div>

                <div
                    className="invisible absolute z-50 flex w-full flex-col bg-gradient-to-br from-[#1E5B53] to-[#CCFFAA] text-white  rounded-b-2xl   shadow-xl group-hover:visible ">

                    {links.map((item, index) => (
                        <div key={index}
                            className="my-2 block  border-gray-100 py-1 font-semibold text-White  hover:text-black hover:bg-white rounded-full md:mx-2 text-center"

                        >

                            <button
                              
                                onClick={() => window.location.href = item.url}
                            >
                                
                                {item.name}
                            </button>
                            <hr></hr>
                        </div>
                    ))}


                </div>
            </div>

        </div>
    );
};

export default Details;