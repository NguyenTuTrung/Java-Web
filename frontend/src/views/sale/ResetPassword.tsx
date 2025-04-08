import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";


const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Generate CAPTCHA
    const generateCaptcha = () => {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCaptcha(random);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate CAPTCHA
        if (captcha !== captchaInput) {
            setError("Captcha không khớp!");
            return;
        }

        // Validate passwords
        if (newPassword !== retypePassword) {
            setError("Mật khẩu không khớp!");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/staffs/reset-password?email=${email}`,
                {
                    newPassword,
                }
            );

            if (response.status === 200) {
                setSuccess("Mật khẩu đã được đặt lại thành công!");
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = "/auth/sign-in"
                }, 1000);
            }
        } catch (err) {
            setError("Có lỗi xảy ra! Vui lòng thử lại.");
        }
    };

    // Initialize CAPTCHA
    React.useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
                    Reset Password
                </h1>
                <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Chú ý: </strong>
                    <span className="block sm:inline">
                        Đây là trang bảo mật, không tiết lộ thông tin hoặc gửi liên kết này cho bất kỳ ai khác. Nếu bị phát hiện, bạn sẽ phải chịu trách nhiệm.
                    </span>
                </div>


                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <form onSubmit={handleReset}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                            Retype Password
                        </label>
                        <input
                            type="password"
                            id="retypePassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CAPTCHA</label>
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-200 text-gray-800 font-mono px-4 py-2 rounded-md">
                                {captcha}
                            </div>
                            <button
                                type="button"
                                className="text-blue-500 underline"
                                onClick={generateCaptcha}
                            >
                                Refresh
                            </button>
                        </div>
                        <input
                            type="text"
                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            placeholder="Nhập CAPTCHA"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
