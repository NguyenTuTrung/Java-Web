import { Link, useNavigate } from "react-router-dom"
import VoucherForm from "../VoucherForm"
import type { SetSubmitting, InitialData } from "../VoucherForm"
import { Notification } from "@/components/ui"
import { AdaptableCard } from "@/components/shared"
import instance from "@/axios/CustomAxios"
import toast from '@/components/ui/toast'

const VoucherNew = () => {
    const navigate = useNavigate()

    const addVoucher = async (data: InitialData) => {
        try {
            const response = await instance.post<{ success: boolean }>('/voucher/add', data)
            return response.status
        } catch (error) {
            console.error('Error adding voucher:', error)
            return false
        }
    }

    const handleFormSubmit = async (
        values: InitialData,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)
            const success = await addVoucher(values)

            if (success == 201) {
                toast.push('Thêm mới thành công')
                navigate('/admin/manage/voucher')
            } else {
                toast.push(
                    <Notification
                        title="Thêm mới thất bại!"
                        type="danger"
                        duration={2500}
                    />,
                    {
                        placement: 'top-center'
                    }
                )
            }
        } catch (error) {
            toast.push(
                <Notification
                    title="Đã xảy ra lỗi!"
                    type="danger"
                    duration={2500}
                />,
                {
                    placement: 'top-center'
                }
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate('/admin/manager/voucher')
    }

    const breadcrumbItems = [
        { label: 'Trang Chủ', path: '/' },
        { label: 'Quản Lý', path: '/manage' },
        { label: 'Quản Lý Voucher', path: '/manage/voucher' },
        { label: 'Thêm Phiếu Giảm Giá', path: '', current: true }
    ]

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {/* Breadcrumb */}
            <div className="lg:flex items-center justify-between mb-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbItems.map((item, index) => (
                            <li key={item.path || index}>
                                <div className="flex items-center">
                                    {index > 0 && <span className="mx-2">/</span>}
                                    {item.current ? (
                                        <span className="text-gray-500">
                                            {item.label}
                                        </span>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className="text-gray-700 hover:text-blue-600"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            <VoucherForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </AdaptableCard>
    )
}

export default VoucherNew