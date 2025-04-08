import React from 'react';

const MyComponent = ({ isOpen, onRequestClose, onConfirm, title, message }) => {
    if (!isOpen) return null; // Không hiển thị nếu không mở

    return (
        <div className={`fixed top-20 right-4 p-4 bg-orange-200 border-l-4 border-orange-400 shadow-lg rounded-lg z-20 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className='flex p-2'>
                <svg viewBox="0 0 24 24" className="text-yellow-600 w-5 h-5 sm:w-5 sm:h-5 mr-3">
                    <path fill="currentColor"
                        d="M23.119,20,13.772,2.15h0a2,2,0,0,0-3.543,0L.881,20a2,2,0,0,0,1.772,2.928H21.347A2,2,0,0,0,23.119,20ZM11,8.423a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Zm1.05,11.51h-.028a1.528,1.528,0,0,1-1.522-1.47,1.476,1.476,0,0,1,1.448-1.53h.028A1.527,1.527,0,0,1,13.5,18.4,1.475,1.475,0,0,1,12.05,19.933Z">
                    </path>
                </svg>
                <h6>{message}</h6>
            </div>
            <div className="flex justify-end space-x-2">
                <button onClick={onConfirm} className="bg-green-500 text-white px-2 py-1 rounded">Có</button>
                <button onClick={onRequestClose} className="bg-red-500 text-white px-2 py-1 rounded">Không</button>
            </div>
        </div>
    );
};

export default MyComponent;
