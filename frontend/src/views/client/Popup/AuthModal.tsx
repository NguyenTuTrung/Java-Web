import React, { Fragment, SetStateAction, useState } from 'react'
import { useAuthContext } from '../auth/AuthContext'
import { loginApi, registerApi } from '../auth/api'
import ForgotPasswordModal from './ForgotPasswordModal'

interface AuthModalProps {
    isOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, setIsModalOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { setUser } = useAuthContext()
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const response = await loginApi(email, password)
                localStorage.clear()
                localStorage.setItem('ACCESS_TOKEN', response.data.token)
                localStorage.setItem('REFRESH_TOKEN', response.data.refresh_token)
                setUser({
                    username: response.data.username
                })
                onClose()
                window.location.reload();
            } else {
                const defaultRoleId = 3
                const response = await registerApi(defaultRoleId, password, email)
                localStorage.clear()
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('ACCESS_TOKEN', response.data.token)
                localStorage.setItem('REFRESH_TOKEN', response.data.refresh_token)
                setUser({
                    username: response.data.username
                })
                onClose()
            }
        } catch (err) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Fragment>
            <div
                className={`bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex ${isOpen ? '' : 'hidden'}`}>
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg bg-red-800 text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={onClose}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="#c6c7c7"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>

                        <div className="p-5 mr-1">
                            <div className="text-center">
                                <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900 mt-8">
                                    {isLogin ? 'Đăng nhập tài khoản của bạn' : 'Tạo tài khoản mới'}
                                </p>
                                <p className="mt-2 text-sm leading-4 text-slate-600">
                                    {isLogin
                                        ? 'Chào mừng trở lại! Vui lòng nhập thông tin chi tiết của bạn.'
                                        : 'Tham gia với chúng tôi! Nhập thông tin chi tiết của bạn bên dưới.'}
                                </p>
                            </div>


                            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                                <div className="h-px w-full bg-slate-200"></div>

                                <div className="h-px w-full bg-slate-200"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full text-black">
                                <label htmlFor="email" className="sr-only">
                                    Địa chỉ email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 px-6 py-4 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <label htmlFor="password" className="sr-only">
                                    Mật khẩu
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-6 py-4 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {isLogin && (
                                    <p className="mb-3 mt-2 text-sm text-gray-500">
                                        <button
                                            type="button"
                                            className="text-blue-800 hover:text-blue-600"
                                            onClick={() => {
                                                setIsForgotPasswordOpen(true) // Mở modal quên mật khẩu
                                                setIsModalOpen(false)
                                            }}
                                        >
                                            Quên mật khẩu?
                                        </button>
                                        {/* <a href="/client/forgot-password" className="text-blue-800 hover:text-blue-600">
                                        Quên mật khẩu?
                                    </a> */}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white mt-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (isLogin ? 'Đăng Nhập' : 'Đăng ký')}
                                </button>
                            </form>

                            {error && <p className="mt-2 text-red-500">{error}</p>}

                            <div className="mt-10 text-center text-sm text-slate-600">
                                {isLogin ? (
                                    <>
                                        Bạn chưa có tài khoản?{' '}
                                        <button
                                            onClick={() => setIsLogin(false)}
                                            className="font-medium text-[#4285f4]"
                                        >
                                            Đăng ký ngay
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Bạn đã có tài khoản?{' '}
                                        <button
                                            onClick={() => setIsLogin(true)}
                                            className="font-medium text-[#4285f4]"
                                        >
                                            Đăng nhập
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <ForgotPasswordModal
                setIsOpenForgotModal={setIsForgotPasswordOpen}
                setIsOpenLoginModal={setIsModalOpen}
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </Fragment>
    )
}

export default AuthModal
