import { useEffect, useState } from "react";
import React, { ReactNode } from "react";
interface ChildComponentProps {
    childrenNav?: ReactNode;
    childrenArticle?: ReactNode;
    label: string;
}

const FormComponent: React.FC<ChildComponentProps> = (
    { label, childrenNav, childrenArticle }) => {

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-50 w-full h-full">
            {/* <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#1E5B53] to-[#CCFFAA] text-white shadow-gray-900/20 shadow-lg mb-10 p-6">
                <h6 className="block antialiased tracking-normal font-sans text-xl font-bold leading-relaxed text-white text-center">{label}</h6>
            </div> */}

            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 overflow-hidden xl:col-span-3 border border-blue-gray-100 shadow-sm ">
                {childrenNav}
                <div>
                    {childrenArticle}
                </div>
            </div>
        </div>
    );
}

export default FormComponent;