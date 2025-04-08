
import React, { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: { email: string }) => void;
}

const TestLogin: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== retypePassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        if (isLogin) {
            // Xử lý đăng nhập
            onLoginSuccess({ email });
        } else {
            // Xử lý đăng ký
            // Sau khi đăng ký thành công có thể chuyển về form đăng nhập
            setIsLogin(true);
            setPassword('');
            setRetypePassword('');
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setRetypePassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nhập lại mật khẩu
                            </label>
                            <input
                                type="password"
                                value={retypePassword}
                                onChange={(e) => setRetypePassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </button>
                        <button
                            type="button"
                            onClick={switchMode}
                            className="w-full text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full text-gray-500 hover:text-gray-600 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestLogin;