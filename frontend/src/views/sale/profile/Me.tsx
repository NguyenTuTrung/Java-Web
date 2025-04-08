import { Link, Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/views/client/Navbar/Navbar'
import { Fragment, useEffect } from 'react'
import CartDrawer from '@/views/sale/CartDrawer'
import Aos from 'aos'
import Footer from '@/views/client/Footer/Footer'

const Me = () => {
    const location = useLocation();

    useEffect(() => {
        Aos.init({
            offset: 100,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100
        })
        Aos.refresh()
    }, [])
    const menu = [
        {
            'label': 'Đơn mua',
            'url': '/me/my-order'
        },
        {
            'label': 'Kho phiếu giảm giá',
            'url': '/me/my-voucher'
        }
    ]
    return (
        <Fragment>
            <CartDrawer></CartDrawer>
            <Navbar></Navbar>
            <div className={"grid grid-cols-12 w-full h-auto gap-2"}>
                <div className={"col-span-2 bg-white flex flex-col gap-4"}>
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            className={`hover:underline border-b ${
                                location.pathname === item.url ? "bg-black text-white" : "text-black"
                            }`}
                        >
                            <Link to={item.url} className={" text-[18px] p-5 "}>
                                <div className={"px-4"}>{item.label}</div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className={"col-span-10 bg-white p-5 min-h-svh"}>
                    <Outlet />
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </Fragment>
    )
}
export default Me
