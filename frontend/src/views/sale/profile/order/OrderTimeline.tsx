import React from 'react';
import { Timeline, Card, Typography } from 'antd';
import {
    FaRegFileAlt,
    FaEdit,
    FaTruck,
} from 'react-icons/fa';
import {
    MdOutlineCancelPresentation,
    MdOutlineChangeCircle,
    MdOutlineConfirmationNumber,
    MdPayment,
} from 'react-icons/md';
import { FaTruckFast } from 'react-icons/fa6';
import { GiConfirmed } from 'react-icons/gi';
import FormatDate from './FormatDate';

const { Text } = Typography;

interface BillHistoryItem {
    status: number;
    createAt: string;
    note: string;
}

const OrderTimeline: React.FC<{ billHistory: BillHistoryItem[] }> = ({ billHistory }) => {
    return (
        <Card style={{ marginTop: '20px', backgroundColor: 'white' }}>
            <Text strong className="text-lg mb-4 block">Lịch sử đơn hàng</Text>
            <div className="container overflow-x-auto mb-3">
                <Timeline
                    pending
                    className="custom-timeline"
                    style={{ height: '400px', overflowY: 'auto' }}
                >
                    {billHistory.map((item, index) => {
                        // Xác định icon, màu sắc và tiêu đề dựa trên trạng thái
                        const icon =
                            item.status === 0 ? <FaRegFileAlt />
                                : item.status === 1 ? <FaRegFileAlt />
                                    : item.status === 2 ? <MdOutlineConfirmationNumber />
                                        : item.status === 3 ? <MdPayment />
                                            : item.status === 4 ? <FaTruck />
                                                : item.status === 5 ? <FaTruckFast />
                                                    : item.status === 6 ? <GiConfirmed />
                                                        : item.status === 7 ? <MdOutlineCancelPresentation />
                                                            : item.status === 8 ? <MdOutlineChangeCircle />
                                                                : item.status === 500 ? <FaEdit /> : null;

                        const color =
                            item.status === 1 ? '#024FA0' :
                                item.status === 3 ? '#F2721E' :
                                    item.status === 4 ? '#50B846' :
                                        item.status === 500 ? '#FFBC05' :
                                            item.status === 7 ? '#9C281C'
                                                : item.status === 8 ? '#7925C7' : '#2DC255';

                        const title =
                            item.status === 1 ? 'Tạo đơn hàng'
                                : item.status === 0 ? 'Chờ thanh toán'
                                    : item.status === 2 ? 'Chờ xác nhận'
                                        : item.status === 3 ? 'Xác nhận thanh toán'
                                            : item.status === 4 ? 'Chờ giao'
                                                : item.status === 5 ? 'Đang giao'
                                                    : item.status === 6 ? 'Hoàn thành'
                                                        : item.status === 7 ? 'Hủy'
                                                            : item.status === 8 ? 'Hoàn 1 phần'
                                                                : item.status === 500 ? 'Chỉnh sửa đơn hàng' : '';

                        return (
                            <Timeline.Item
                                key={index}
                                dot={icon}
                                color={color}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h6 className="mt-2 text-lg font-semibold">{title}</h6>
                                        <p className="text-gray-600">{item.note}</p>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <FormatDate date={item.createAt} />
                                    </div>
                                </div>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </div>
        </Card>
    );
};

export default OrderTimeline;