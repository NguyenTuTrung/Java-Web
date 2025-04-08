import { useEffect, useState } from "react";
import React, { ReactNode } from "react";
interface ChildComponentProps {
    label: string;
    children?: ReactNode;
}

const Dropdown: React.FC<ChildComponentProps> = ({ label, children }) => {
    // const [isOpen, setIsOpen] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        // <div
        // // className=" relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-100  shadow-gray-900/20 shadow-lg mb-5 p-2"
        // >

        //     <div >
        //         <button
        //             onClick={() => setIsOpen(!isOpen)}
        //             className="w-full justify-between flex hover:bg-gray-200 p-2 rounded-md"
        //         >
        //             <h4 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-black ">
        //                 {label}
        //             </h4>
        //             {isOpen ? "" : ""}
        //         </button>
        //     </div>
        //     <div
        //         className={`transition-max-height duration-500 ease-in-out overflow-hidden  ${isOpen ? "max-h-" : "max-h-0"
        //             }`}
        //     >

        //         {children}
        //     </div>
        // </div>



        <div>
            <button onClick={toggleExpand}>
                <h4 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-black ">
                    {label}
                </h4>
            </button>
            <div
                style={{
                    height: isExpanded ? 'auto' : '0px',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                }}
            >
                 {children}
            </div>
        </div>
    );
};

export default Dropdown;


// // Lỗi kia tôi ko mò đc
// //  b thêm icon xem nào
// // do cài thiếu thư viên  icon

// https://react-icons.github.io/react-icons/icons/hi/

// cái này nàycos sẵn của template