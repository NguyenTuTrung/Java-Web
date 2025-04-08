import React, { useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { useAuthContext } from '@/views/client/auth/AuthContext'
import { HiOutlineTicket } from 'react-icons/hi'
import { CartResponseDTO } from '@/views/sale'
import { toast } from 'react-toastify'

type VoucherDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string;
    customerId: number | null;
    customerName: string | null;
    customerEmail: string | null;
};

const MyVoucher = () => {
    const { user } = useAuthContext();
    const [data, setData] = useState<VoucherDTO[]>([])

    function copyToClipboard(code: string) {
        navigator.clipboard.writeText(code).then(() => {
            toast('Mã đã được sao chép: ' + code);
        }).catch(err => {
            console.error('Không thể sao chép mã: ', err);
        });
    }

    useEffect(() => {
        getMyVoucher();
    }, [])

    const getMyVoucher = async () => {
        const params = {
            page: 0,
            size: 50,
            customerId: user?.customerId || ''
        }
        const response = await instance.get(`/voucher/find-valid-voucher`, { params: params })
        setData(response.data.content || [])
    }
    return (
        <div>
            <div>
                <h1 className="font-semibold text-xl text-black mb-4 text-transform: uppercase">Danh sách phiếu giảm giá của bạn</h1>
            </div>
            <div>
                {data.length > 0 ? (
                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'}>
                        {data.map((item, index) => (
                            <div key={index} className={'flex h-40 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer'}>
                                <div className={'w-24 bg-[#ee4d2d] flex items-center justify-center'}>
                                    <div className={'text-white'}>
                                        <HiOutlineTicket size={32} />
                                    </div>
                                </div>

                                <div className={'flex-1 px-3 py-2 relative'}>
                                    <div className={'inline-block bg-[#ee4d2d] text-white text-xs px-1.5 py-1 rounded-sm mb-1'}>
                                        {item.code}
                                    </div>

                                    <div className={'text-gray-800 font-medium text-base mb-1'}>
                                        Giảm: {item.maxPercent}%  <br></br>
                                        Đơn tối thiểu: <span className="text-blue-600 font-semibold text-lg"> {item.minAmount.toLocaleString('vi')} vnđ</span>
                                    </div>


                                    <div className={'flex items-center gap-1 text-xs'}>
                                        <span className={'text-gray-400'}>- HSD: {item.endDate}</span>
                                    </div>


                                    <div className={'text-[#0055AA] text-xs mt-1'}>
                                        Chi tiết {'>>'}
                                    </div>

                                    <button
                                        className={'absolute right-3 top-1/2 -translate-y-1/2 bg-[#ee4d2d] text-white text-sm px-3 py-1 rounded'}
                                        data-code={item.code}
                                        onClick={() => copyToClipboard(item.code)}
                                    >
                                        Copy mã
                                    </button>

                                    <div className={'absolute -left-[6px] top-0 h-full flex flex-col justify-between py-1'}>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className={'w-3 h-3 rounded-full bg-gray-100'}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center py-10">
                        <p className="flex justify-center py-28 items-center text-xl font-semibold text-gray-500">
                            Không có khuyến mãi nào phù hợp
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default MyVoucher