import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "@/axios/CustomAxios";
import { OrderResponseDTO } from "@/@types/order";
import { Avatar, Steps } from "@/components/ui";
import { FiPackage } from "react-icons/fi";
import StatusOrderFormat from '@/views/util/StatusOrderFormat'

const InvoiceSearchResult = () => {
    const { codeOrder } = useParams();
    const [orderResponseDTO, setOrderResponseDTO] = useState<OrderResponseDTO>();

    const getDetailOrder = () => {
        instance.get(`orders/by-code/${codeOrder}`).then(function (response) {
            if (response.status === 200 && response.data) {
                setOrderResponseDTO(response.data);
            }
        });
    };

    useEffect(() => {
        getDetailOrder();
    }, []);

    return (
        <div>
            <div >
                <h3 className="text-5xl font-bold text-gray-800 mb-5 flex items-center justify-center mt-5 uppercase">
                    <img
                        src="https://img.pikbest.com/png-images/20191117/cute-golden-bell-gif_2515423.png!sw800"
                        alt="Golden Bell"
                        className="ml-3 w-10 h-10"
                    />
                    Thông tin đơn hàng của bạn
                    <img
                        src="https://img.pikbest.com/png-images/20191117/cute-golden-bell-gif_2515423.png!sw800"
                        alt="Golden Bell"
                        className="ml-3 w-10 h-10"
                    />
                </h3>

            </div>
            <div className="p-10 grid grid-cols-12 gap-8 bg-gray-200 border ">
                <div className="col-span-4 bg-white shadow-lg p-5 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-5">
                        Lịch sử đơn hàng
                    </h3>
                    {orderResponseDTO?.historyResponseDTOS && (
                        <Steps
                            current={orderResponseDTO.historyResponseDTOS.length}
                            vertical
                        >
                            {orderResponseDTO.historyResponseDTOS.map((item, index) => (
                                <Steps.Item
                                    key={index}
                                    title={<StatusOrderFormat status={item.status}/>}
                                    description={item.note}
                                />
                            ))}
                        </Steps>
                    )}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="col-span-4 bg-white shadow-lg p-5 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-5">
                        Thông tin đơn hàng
                    </h3>
                    <div className="space-y-4">
                        <p><strong>Tên người nhận:</strong> {orderResponseDTO?.recipientName}</p>
                        <p><strong>Số điện thoại:</strong> {orderResponseDTO?.phone}</p>
                        <p><strong>Địa chỉ:</strong> {orderResponseDTO?.address}</p>
                        <p>
                            <strong>Hình thức thanh toán:</strong>{" "}
                            {orderResponseDTO?.payment === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
                        </p>
                    </div>
                </div>

                {/* Thông tin thanh toán */}
                <div className="col-span-4 bg-white shadow-lg p-5 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-5">
                        Thông tin thanh toán
                    </h3>
                    <div className="space-y-3">
                        <p className="text-red-500">
                            <strong>Tổng tiền:</strong>{' '}
                            {Math.round(Number(orderResponseDTO?.subTotal)).toLocaleString('vi') + 'đ'}
                        </p>
                        <p className="text-red-500">
                            <strong>Giảm giá:</strong>{' '}
                            {Math.round(Number(orderResponseDTO?.discount || 0)).toLocaleString('vi') + 'đ'}
                        </p>
                        <p className="text-red-500">
                            <strong>Phí vận chuyển:</strong>{' '}
                            {Math.round(Number(orderResponseDTO?.deliveryFee || 0)).toLocaleString('vi') + 'đ'}
                        </p>
                        <p className="text-red-500">
                            <strong>Tổng thanh toán:</strong>{' '}
                            {Math.round(Number(orderResponseDTO?.total || 0)).toLocaleString('vi') + 'đ'}
                        </p>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="col-span-12 bg-white shadow-lg p-5 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-5">
                    Danh sách sản phẩm
                    </h3>
                    <div>
                        {
                            orderResponseDTO?.orderDetailResponseDTOS && Array.isArray(orderResponseDTO?.orderDetailResponseDTOS) &&
                            orderResponseDTO?.orderDetailResponseDTOS.map((item, index) => (
                                <div key={index} className="flex justify-between items-center shadow p-2">
                                    <div className="product-image">
                                        {
                                            item.productDetailResponseDTO.images.length > 0 ? (
                                                <Avatar size={120}
                                                    src={item.productDetailResponseDTO.images[0].url} />
                                            ) : (
                                                <Avatar size={120} icon={<FiPackage />} />
                                            )
                                        }
                                    </div>
                                    <div className="ltr:ml-2 rtl:mr-2">
                                        <h6 className="mb-2">{item.productDetailResponseDTO?.name}</h6>
                                        <div className="mb-1">
                                            <span className="capitalize">Cỡ: </span>
                                            <span
                                                className="font-semibold">{item.productDetailResponseDTO?.size.name}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="capitalize">Màu: </span>
                                            <span
                                                className="font-semibold">{item.productDetailResponseDTO?.color.name}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="capitalize">Đơn giá: </span>
                                            <span
                                                className="font-semibold text-red-500">{Math.round(item.productDetailResponseDTO?.price).toLocaleString('vi') + "đ"}</span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="capitalize">Số lượng: </span>
                                            <span
                                                className="font-semibold">{item.quantity}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1">
                                            <span className="capitalize">Thành tiền: </span>
                                            <span
                                                className="font-semibold text-red-500">{Math.round(item.productDetailResponseDTO?.price * item.quantity).toLocaleString("vi") + "đ"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSearchResult;
