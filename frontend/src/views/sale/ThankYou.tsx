import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ThankYouMessage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 text-gray-800 p-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                    Cảm ơn bạn đã đặt hàng!
                    <FaCheckCircle className="text-green-500 text-6xl ml-4" />
                </h1>
                <p className="text-lg mb-4">
                    Đơn hàng của bạn đã được ghi nhận thành công. Chúng tôi sẽ liên hệ với
                    bạn sớm nhất để xác nhận và giao hàng.
                </p>
                <p className="text-base italic text-gray-600 mt-6">
                    Trân trọng, <br />
                    Đội ngũ cửa hàng
                </p>
            </div>
                <button className="mt-10 bg-blue-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300">
                    <a href={"/"}>
                        Quay lại trang chủ
                    </a>
                </button>

        </div>
    );
};

export default ThankYouMessage;
