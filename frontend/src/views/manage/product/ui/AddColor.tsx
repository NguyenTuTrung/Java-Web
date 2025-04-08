import React, { SetStateAction, useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

interface IProps {
    selectedColors: any[]
    setSelectedColors: React.Dispatch<SetStateAction<any>>
}

type Color = {
    id: number;
    ma: string;
    ten: string;
};
const AlpineModal: React.FC<IProps> = ({ selectedColors, setSelectedColors }) => {
    const [showModal, setShowModal] = useState(false);
    const [colors, setColors] = useState<Color[]>([]);
    const [newColor, setNewColor] = useState<Color[]>([]);

    const fetchColors= async () => {

        try {
            const response = await axios.get(
                'http://localhost:8080/api/color/'
            );
            setColors(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error("Error fetching todos: ", error);
        }
    };
    useEffect(() => {
        fetchColors()
    }, []);

    const handleColorSelect = (color:Color) => {
        if (newColor.some((c) => c.id === color.id)) {
            setNewColor(newColor.filter((c) => c.id !== color.id));
        } else {
            setNewColor([...newColor, color]);
        }
    };

    const handleRemoveColor = (color:Color) => {
        setSelectedColors(selectedColors.filter(c => c !== color));
    };
    const handleCreate = () => {
        setSelectedColors([...selectedColors, ...newColor]);
        setShowModal(false);
        setNewColor([]);
    };
    return (
        <div>
            <div className='flex '>
                <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-100 shadow-gray-900/20 shadow-lg mb-2 p- w-[90%] ">
                    <div className="flex flex-wrap gap-2 ">

                        {selectedColors.map((color,index) => (
                                    // <div className='text-left w-[30%] h-[17vh] mx-auto p-6 overflow-y-auto'> 
                            
                            <div
                            key={color.id}
                            className="m-2 p-2 rounded-md flex items-center"
                            style={{ backgroundColor: color.ten }}
                            >
                                <span className="mr-2">{color.ma}</span>
                                <button
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    onClick={() => handleRemoveColor(color)}
                                    >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                            />
                                    </svg>
                                </button>
                            </div>
                        //  </div> 
                        ))}
                    </div>
                </div>
                <div className='relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-100 shadow-gray-900/20 shadow-lg mb-2  '>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded"
                        onClick={() => setShowModal(true)}
                    >
                        <AddIcon />
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">

                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Chọn màu sắc
                                        </h3>
                                    </div>
                                </div> 
                                <div className="mt-5 sm:mt-4 grid grid-cols-5 gap-4  h-[57vh] mx-auto overflow-y-auto">
                                    {colors.map((color,index) => (
                                        <button
                                            key={color.id}
                                            className={`flex flex-col items-center justify-center rounded-md px-4 py-2 transition-colors ${newColor.some((c) => c.id === color.id)
                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                            onClick={() => handleColorSelect(color)}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full mb-2"
                                                style={{ backgroundColor: color.ten }}
                                            ></div>
                                            <span className="text-sm">{color.ma}</span>
                                        </button>

                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={
                                        handleCreate
                                    }
                                > 
                                    Create
                                </button>
                               
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AlpineModal;