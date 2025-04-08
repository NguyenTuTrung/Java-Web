import React, { useEffect, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import { useSaleContext } from '@/views/sale/SaleContext'
import { HiOutlineMenu, HiOutlineShoppingBag, HiUser, HiUserCircle } from 'react-icons/hi'
import AuthModal from '../Popup/AuthModal'
import { useAuthContext } from '../auth/AuthContext'
import { Link } from 'react-router-dom'
import Logo from '@/components/template/Logo'
import CartDrawer from '@/views/sale/CartDrawer'
import { Badge } from '@/components/ui'


const Menu = [
    {
        id: 1,
        name: 'Trang chủ',
        link: '/'
    },
    {
        id: 2,
        name: 'Sản phẩm của chúng tôi',
        link: '/collections'
    },
    {
        id: 3,
        name: 'Tra cứu đơn hàng',
        link: '/check-order'
    },
    {
        id: 4,
        name: 'Giới thiệu',
        link: '/introduce'
    },
    {
        id: 5,
        name: 'Giá Tốt',
        link: '/sales'
    }


]

const DropdownLinks = [
    {
        id: 1,
        name: 'Tra cứu đơn hàng',
        link: '/check-order'
    }
]


const Navbar = ({ isLandingPage = false }: { isLandingPage?: boolean }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const { isOpenCartDrawer, setIsOpenCartDrawer } = useSaleContext()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user, setUser } = useAuthContext()
    const { selectedCart } = useSaleContext();


    const handleLoginClick = () => {
        setIsModalOpen(true)
    }

    const handleLogoutClick = () => {
        localStorage.clear()
        // Reset user state after logout
        setIsModalOpen(false) // Đóng modal khi đăng xuất
        setDropdownVisible(false)
        setUser(null)
        window.location.href = '/'
    }


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('user-dropdown')
            const userButton = document.getElementById('user-button')
            if (
                dropdown &&
                !dropdown.contains(event.target as Node) &&
                !userButton?.contains(event.target as Node)
            ) {
                setDropdownVisible(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [user])


    return (
        <div
            className={` top-0 duration-200 w-full z-30 ${isLandingPage ? '!bg-black !bg-opacity-0 fixed !text-white' : 'relative text-black shadow'}`}>
            {/* upper Navbar */}
            <CartDrawer></CartDrawer>
            <div className=" py-8">
                <div className="px-[2%] flex justify-between items-center">
                    <div>
                        <a href="/"
                           className={`md:text-4xl sm:text-3xl flex gap-2  dark:text-white font-hm font-bold  text-shadow-sm ${isLandingPage ? 'text-white' : 'text-black'}`}>
                            <Logo />
                        </a>
                    </div>

                    <div>
                        <ul className="sm:flex hidden items-center gap-4">
                            {Menu.map((data) => (
                                <li key={data.id}>
                                    <Link
                                        to={data.link}
                                        className={`inline-block menu-title px-4 duration-200 text-[14px] 2xl:text-xl  hover:underline hover:text-gray-800 underline-offset-4 text-black dark:text-white font-sans font-bold ${isLandingPage ? 'text-white' : 'text-black'} text-shadow-sm`}
                                    >
                                        {data.name}
                                    </Link>
                                </li>
                            ))}
                            {/* Simple Dropdown and Links */}

                        </ul>
                    </div>
                    {/* search bar */}
                    <div className="flex justify-between items-center gap-4 text-shadow-sm">
                        <div>
                            <ul>
                                <li className="group relative cursor-pointer">
                                    <a href="#" className="flex items-center">
                                        <p className={`${isLandingPage ? 'text-white' : 'text-black'} menu-title`}>
                                            <HiOutlineMenu size={25} />
                                        </p>
                                        <p>
                                            <FaCaretDown
                                                className="transition-all duration-200 group-hover:rotate-180 text-xl" />
                                        </p>
                                    </a>
                                    <div
                                        className="absolute z-[9999] hidden group-hover:block w-[250px] rounded-md  p-2 text-black shadow-md">
                                        <ul>
                                            {DropdownLinks.map((data) => (
                                                <li key={data.id}>
                                                    <a
                                                        href={data.link}
                                                        className={`inline-block w-full rounded-md p-2 hover:text-white hover:bg-gray-100 hover:bg-opacity-50 ${isLandingPage ? 'text-white' : 'text-black'} menu-title`}
                                                    >
                                                        {data.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <button
                            className={` ${isLandingPage ? 'text-white' : 'text-black'} menu-title text-shadow-sm"`}
                            onClick={() => setIsOpenCartDrawer(!isOpenCartDrawer)}
                        >
                            <Badge content={selectedCart?.cartDetailResponseDTOS.length} maxCount={5}>
                                <HiOutlineShoppingBag size={25} />
                            </Badge>
                        </button>
                        <div className="relative">
                            {user ? (
                                <>
                                    {/* User Dropdown */}
                                    <button
                                        id="user-button"
                                        className={`menu-title flex items-center gap-2 ${isLandingPage ? 'text-white' : 'text-black'} dark:text-white hover:text-gray-600 transition-colors focus:outline-none`}
                                        onClick={() => setDropdownVisible(!dropdownVisible)}
                                    >
                                        <HiUserCircle size={25} />
                                        <span className="text-sm font-medium  text-shadow-sm">{user.username}</span>
                                    </button>
                                    {dropdownVisible && (
                                        <div
                                            id="user-dropdown"
                                            className={`absolute bg-white right-0 mt-2 w-56  dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 ${isLandingPage ? 'text-white' : 'text-black'}`}
                                        >
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <HiUserCircle className="text-gray-500 dark:text-gray-400"
                                                                  size={30} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-white">
                                                            {user.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* User Actions */}
                                            <Link
                                                to={`/customer/${user.username}`}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                            >
                                                Thông tin người dùng
                                            </Link>
                                            <Link
                                                to={`/me/my-order`}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                            >
                                                Đơn hàng đã mua
                                            </Link>
                                            <Link
                                                to={`/me/my-voucher`}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                            >
                                                Kho phiếu giảm giá
                                            </Link>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded-md"
                                                onClick={handleLogoutClick}
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    className="flex items-center gap-2 hover:text-gray-600 transition-colors text-black "
                                    onClick={handleLoginClick}
                                >
                                    <HiUser size={25} className={'menu-title text-black text-shadow-sm'} />
                                    <span
                                        className={`text-sm font-medium  ${isLandingPage ? 'text-white' : 'text-black'} menu-title text-shadow-sm`}>Đăng nhập</span>
                                </button>
                            )}

                            {/* Auth Modal */}
                            <AuthModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                                       onClose={() => setIsModalOpen(false)} />
                        </div>

                    </div>
                </div>
            </div>
            {/* lower Navbar */}
            <div data-aos="zoom-in" className="flex justify-center">

            </div>
        </div>
    )
}

export default Navbar


// {
//     "message": "Get user's detail successfully",
//     "status": "OK",
//     "data": {
//         "username": "hungit2301@gmail.com",
//         "status": "Ho?t Ð?ng",
//         "enabled": true,
//         "roleName": null,
//         "provider": null,
//         "socialId": null
//     }
// }

// {
//     "message": "Login successfully",
//     "status": "OK",
//     "data": {
//         "tokenType": "Bearer",
//         "id": 5,
//         "username": "hungit2301@gmail.com",
//         "roles": [
//             "ROLE_CUSTOMER"
//         ],
//         "message": "Login successfully",
//         "token": "eyJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50SWQiOjUsInN1YmplY3QiOiJodW5naXQyMzAxQGdtYWlsLmNvbSIsInN1YiI6Imh1bmdpdDIzMDFAZ21haWwuY29tIiwiZXhwIjoxNzMyMTg3NDMxfQ.oSgVWSTw1RMyJJCloRoQ3Hp4ixi-zvsL5eNHqXyrcbs",
//         "refresh_token": "7eb4c679-ea02-4ba0-b5e7-0fae13b2203a"
//     }
// }

// vay la do cai dropdown soa ychacws ko phai