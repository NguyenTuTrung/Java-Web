import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import SidePanel from '@/components/template/SidePanel'
import MobileNav from '@/components/template/MobileNav'
import UserDropdown from '@/components/template/UserDropdown'
import SideNav from '@/components/template/SideNav'
import { Link, Route, Routes } from 'react-router-dom'
import { AdminViews, AuthViews, PublicViews } from '@/views'
import Side from '@/components/layouts/AuthLayout/Side'
import Navbar from '@/views/client/Navbar/Navbar'
import Footer from '@/views/client/Footer/Footer'
import { Fragment, useEffect, useState } from 'react'
import 'aos/dist/aos.css'
import SaleProvider from '@/views/sale/SaleContext'
import CartDrawer from '@/views/sale/CartDrawer'
import { useWSContext } from '@/context/WsContext'
import { Badge, Button } from '@/components/ui'
import { HiOutlineBell } from 'react-icons/hi'
import Dropdown from '../ui/Dropdown'
import { useToastContext } from '@/context/ToastContext'
import instance from '@/axios/CustomAxios'
import { formatDistanceToNow, parse } from 'date-fns'
import { vi } from 'date-fns/locale'
import Aos from 'aos'
import { useHasRole } from '@/utils/permission'
import Me from '@/views/sale/profile/Me'
import { MyOrderTable } from '@/views/sale/profile/order/MyOrderTable'
import MyOrderDetail from '@/views/sale/profile/order/MyOrderDetail'
import MyVoucher from '@/views/sale/profile/voucher/MyVoucher'
import LandingPage from '@/views/client/LandingPage'
import PaymentCallback from '@/views/manage/sell/component/payment/PaymentCallback'
import ResetPassword from '@/views/sale/ResetPassword'

type OrderDTO = {
    id: number;
    code: string;
    address: string;
    phone: string;
    recipientName: string | null;
    deleted: boolean;
    createdDate: string;
    status: string;
    type: 'ONLINE' | 'INSTORE';
    payment: 'CASH' | 'TRANSFER';
    total: number;
    deliveryFee: number;
    subTotal: number;
    discount: number;
    customerName: string | null;
    staffName: string | null;
    provinceId: number | null;
    provinceName: string | null;
    districtId: number | null;
    districtName: string | null;
    wardId: number | null;
    wardName: string | null;
    isPayment: boolean;
    discountVoucherPercent: number;
    voucherMinimumSubtotalRequired: number;
};


const Bell = () => {
    const [listOrderCurrent, setListOrderCurrent] = useState<OrderDTO[]>([])
    const getCurrentOrder = (total: number) => {
        console.log('0000000000000')
        const data = {
            'pageIndex': 1,
            'pageSize': total,
            'query': '',
            'sort': {
                'order': 'desc',
                'key': 'createdDate'
            }
        }
        if (total > 0) {
            instance.post('http://localhost:8080/api/v1/orders/overview?status=PENDING&type=ONLINE', data).then(function(response) {
                console.log(response)
                if (response.status === 200 && response?.data?.content) {
                    setListOrderCurrent(response.data.content)
                }
            })
        } else {
            setListOrderCurrent([])
        }
    }

    const { countOrder } = useWSContext()
    const { openNotification } = useToastContext()
    const [prevCountOrder, setPrevCountOrder] = useState<number>(countOrder)

    useEffect(() => {
        if (countOrder > 0 && countOrder > prevCountOrder) {
            openNotification('Bạn có 1 đơn hàng mới', 'Thông báo mới', 'info', 2000)
            setPrevCountOrder(countOrder)
        }
    }, [countOrder])

    const UserAvatar = (
        <div className={'flex justify-center items-center'}>
            <Badge content={countOrder} maxCount={99}>
                <Button
                    variant={'plain'}
                    className={'text-gray-600'}
                    icon={<HiOutlineBell size={25} className={'text-gray-500'} />}
                />
            </Badge>
        </div>
    )

    const calculateDistanceTime = (formattedDate: string) => {
        const date = parse(formattedDate, 'HH:mm dd-MM-yyyy', new Date())
        return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    }

    return (
        <div className={''}>
            <div>
                <Dropdown
                    menuStyle={{ minWidth: 600 }}
                    renderTitle={UserAvatar}
                    placement="bottom-end"
                    onOpen={() => getCurrentOrder(countOrder)}
                >
                    <Dropdown.Item variant="header">
                        <div
                            className="px-3 text-black text-[16px] !hover:bg-gray-600 font-semibold flex items-center gap-2">
                            Danh sách đơn hàng chờ xác nhận mới
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item variant="divider" />
                    {listOrderCurrent.map((item, index) => (
                        <Dropdown.Item
                            key={index}
                            className="mb-4 text-sm font-normal px-0 flex flex-col justify-start !h-auto py-2"
                        >
                            <div
                                className="flex justify-between gap-3 h-full w-full px-4"
                            >
                                <div>
                                    <span className="flex gap-1 items-center w-full">
                                        <span className="">Mã:</span>
                                        <span>{item.code}</span>
                                    </span>
                                </div>


                                <div>
                                    <Link className={'text-green-60 underline-offset-2 underline '}
                                          to={`/admin/manage/order/order-details/${item.id}`}>
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                            <div className={'flex justify-start gap-1 w-full px-4'}>
                                    <span className="">
                                        <span className="">Phương thức: </span>
                                        <span
                                            className={item.payment === 'CASH' ? 'text-green-600' : 'text-blue-600'}>
                                            {item.payment === 'CASH' ? 'Thanh toán khi nhận hàng' : 'Thanh toán ngân hàng'}
                                        </span>
                                    </span>
                            </div>
                            <div className={'flex justify-start gap-1 w-full px-4'}>
                                  <span className="">
                                        <span className="">Trạng thái: </span>
                                        <span
                                            className={item.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}>
                                            {item.status === 'PENDING' ? 'Chờ xác nhận' : 'Không xác định'}
                                        </span>
                                  </span>
                            </div>
                            <div className={'flex justify-start gap-1 w-full px-4'}>
                                  <span className="">
                                        <span className="">Thời gian: </span>
                                        <span>
                                                {calculateDistanceTime(item.createdDate)}
                                        </span>
                                  </span>
                            </div>
                        </Dropdown.Item>
                    ))}
                    {
                        listOrderCurrent.length === 0 && (
                            <div className={'px-4 py-5'}>
                                Danh sách đang trống
                            </div>
                        )
                    }
                </Dropdown>
            </div>
        </div>
    )
}


const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <Bell />
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const AdminLayout = () => {
    return (
        <div className="app-layout-classic flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <div className="h-full flex flex-auto flex-col">
                        <AdminViews />
                    </div>
                </div>
            </div>
        </div>
    )
}
// const ClientLayout = () => {
//
//     useEffect(() => {
//         AOS.init({
//             offset: 100,
//             duration: 800,
//             easing: "ease-in-sine",
//             delay: 100,
//         });
//         AOS.refresh();
//     }, []);
//     return (
//         <div className="app-layout-classic flex flex-auto flex-col">
//             <SaleProvider>
//                 <Navbar/>
//                 <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
//                     <div className="h-full flex flex-auto flex-col ">
//                         <ClientViews/>
//                     </div>
//                     <Footer/>
//                 </div>
//                 <CartDrawer></CartDrawer>
//             </SaleProvider>
//
//         </div>
//     )
// }
const PublicLayout = () => {
    useEffect(() => {
        Aos.init({
            offset: 100,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 100
        })
        Aos.refresh()
    }, [])
    return (
        <Fragment>
            <Navbar />
            <PublicViews />
            <Footer />
            <CartDrawer></CartDrawer>
        </Fragment>
    )
}
const SecurityLayout = () => {
    return (
        <Side>
            <div className="app-layout-classic flex flex-auto flex-col">
                <div className="flex flex-auto min-w-0">
                    <div className="h-full flex flex-auto flex-col">
                        <AuthViews />
                    </div>
                </div>
            </div>
        </Side>
    )
}

const RootLayout = () => {
    return (
        <SaleProvider>
            <Routes>
                {
                    useHasRole(['ROLE_ADMIN', 'ROLE_STAFF']) && <Route path="/admin/*" element={<AdminLayout />} />
                }
                <Route path="/auth/*" element={<SecurityLayout />} />
                <Route path="/*" element={<PublicLayout />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/private/reset-password" element={<ResetPassword />} />
                <Route path={'/me'} element={<Me></Me>}>
                    <Route index path={'my-order'} element={<MyOrderTable />}></Route>
                    <Route path={'my-voucher'} element={<MyVoucher />}></Route>
                    <Route path={'my-order/:id'} element={<MyOrderDetail />}></Route>
                </Route>
            </Routes>
        </SaleProvider>

    )
}

export default RootLayout