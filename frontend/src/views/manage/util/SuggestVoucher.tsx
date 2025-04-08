import { Fragment, useEffect, useState } from 'react'
import { OrderResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { HiOutlineTicket } from 'react-icons/hi'
import { Input } from '@/components/ui'

type TicketDTO = {
    id: number;
    name: string;
    code: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    status: string;
    quantity: number;
    maxPercent: number;
    minAmount: number;
    typeTicket: string; // Thêm các loại nếu cần
    deleted: boolean;
};

const SuggestVoucher = ({ selectedOrder, fetchSelectedOrder }: {
    selectedOrder: OrderResponseDTO,
    fetchSelectedOrder: () => Promise<void>
}) => {
    const [listVoucherSuggest, setListVoucherSuggest] = useState<TicketDTO[]>([])
    const [listVoucherCanUse, setListVoucherCanUse] = useState<TicketDTO[]>([])


    const setFilterVoucherCanUse = (data: TicketDTO[]) => {
        setListVoucherCanUse(data.filter(s => s.minAmount < selectedOrder.subTotal))
    }

    const setFilterVoucherSuggest = (data: TicketDTO[]) => {
        setListVoucherSuggest(data.filter(s => s.minAmount > selectedOrder.subTotal))
    }

    const getBetterVoucher = async () => {
        const params = {
            page: 0,
            size: 100,
            customerId: selectedOrder?.customerResponseDTO?.id,
            sort: "minAmount"
        }
        await instance.get(`voucher/find-valid-voucher`, { params: params }).then(
            function(response) {
                console.log(response)
                Array.isArray(response.data.content) && setFilterVoucherSuggest(response.data.content)
                Array.isArray(response.data.content) && setFilterVoucherCanUse(response.data.content)
            }
        )
    }


    const onUseVoucherById = async (idVoucher: number) => {
        const data = {
            idOrder: selectedOrder.id,
            idVoucher: idVoucher
        }
        const response = await instance.post(`/orders/use-voucher-by-id`, data)
        console.log(response)
        await fetchSelectedOrder()
    }


    useEffect(() => {
        getBetterVoucher()
    }, [selectedOrder])

    return (
        <Fragment>
            <div className={`${selectedOrder.status !== 'PENDING' ? 'hidden' : ''}`}>
                {
                    selectedOrder?.voucherResponseDTO?.code ? (
                            <div className="flex pt-1 pb-3 border px-2 justify-start gap-5 items-center mt-2 relative">
                                <div className="col-span-1 flex items-center text-green-600">
                                    <HiOutlineTicket size={32} />
                                </div>
                                <div className="">
                                    <div>
                                        <p className={'absolute -bottom-1 left-0 text-red-600 text-[12px] font-semibold'}>{selectedOrder.voucherResponseDTO.typeTicket === 'Everybody' ? `(Đang sử dụng) Phiếu công khai - Còn lại:${selectedOrder.voucherResponseDTO.quantity}` : `(Đang sử dụng) Phiếu cá nhân - Còn lại: ${selectedOrder.voucherResponseDTO.quantity}`}</p>
                                        <p>{`Mã phiếu ${selectedOrder.voucherResponseDTO.code}`}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div>
                                        <p>{`Phần trăm tối đa ${selectedOrder.voucherResponseDTO.maxPercent}%`}</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div>
                                        <p>{`Giá trị tối thiểu ${selectedOrder.voucherResponseDTO.minAmount.toLocaleString('vi') + 'đ'}`}</p>
                                    </div>
                                </div>
                            </div>
                        ) :
                        (
                            <div>

                            </div>
                        )
                }
                {
                    (Array.isArray(listVoucherSuggest) && listVoucherSuggest.length > 0) ? (
                            <div>
                                {
                                    listVoucherSuggest[0]?.minAmount > selectedOrder.subTotal ? (
                                            <div className={'py-2 flex'}>
                                                {/*<p className={'text-red-500'}>Cần mua*/}
                                                {/*    thêm {Math.round(listVoucherSuggest[0]?.minAmount - selectedOrder.subTotal).toLocaleString('vi') + 'đ'} giá*/}
                                                {/*    để có thể sử dụng khuyễn mãi tốt hơn*/}
                                                {/*    giảm {listVoucherSuggest[0]?.maxPercent} %*/}
                                                {/*</p>*/}
                                            </div>
                                        ) :
                                        (
                                            <div className={'py-2 flex'}>
                                                <Input
                                                    disabled
                                                    className="text-green-800"
                                                    placeholder={`Khuyễn mãi tốt nhất cho bạn ${listVoucherSuggest[0]?.maxPercent} %`}

                                                    suffix={
                                                        selectedOrder.discountVoucherPercent == listVoucherSuggest[0]?.maxPercent ?
                                                            (
                                                                <button>
                                                                    Đang sử dụng
                                                                </button>
                                                            ) :
                                                            (
                                                                <button
                                                                    onClick={() => onUseVoucherById(listVoucherSuggest[0]?.id)}
                                                                >
                                                                    Sử dụng
                                                                </button>
                                                            )
                                                    }
                                                ></Input>
                                            </div>
                                        )

                                }
                            </div>
                        )
                        :
                        (
                            <div className={'pt-2 flex'}>
                                <p>Không có voucher phù hợp hơn</p>
                            </div>
                        )
                }
            </div>
        </Fragment>
    )

}
export default SuggestVoucher