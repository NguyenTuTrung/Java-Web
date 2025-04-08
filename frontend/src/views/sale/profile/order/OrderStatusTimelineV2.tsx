// import React from 'react';
// import { Card, Typography, Timeline } from 'antd';
// import { ClockCircleOutlined } from '@ant-design/icons';
// import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa';
// import { MdCancel, MdOutlineCancelPresentation, MdOutlineChangeCircle, MdOutlineConfirmationNumber, MdOutlineReplayCircleFilled, MdPayment } from 'react-icons/md';
// import { GiConfirmed } from 'react-icons/gi';



// const { Title } = Typography;

// // Component để định dạng ngày tháng
// const FormatDate: React.FC<{ date: string }> = ({ date }) => {
//   const formattedDate = new Date(date).toLocaleString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
//   return <span>{formattedDate}</span>;
// };

// // Component để định dạng ghi chú
// const formatNote = (note: string) => {
//   return <p className="text-gray-600">{note}</p>;
// };


// const listStatus = [
//   {
//     id: 0,
//     name: "Tạo hóa đơn",
//     status: "TAO_HOA_DON",
//     color: "#007BFF",
//     title: "Tạo hóa đơn",
//     icon: <FaRegFileAlt />, 
//   },
//   {
//     id: 1,
//     name: "Chờ xác nhận",
//     status: "CHO_XAC_NHAN",
//     color: "#FFC107",
//     title: "Chờ xác nhận",
//     icon: <FaRegFileAlt />,
//   },
//   {
//     id: 2,
//     name: "Xác nhận",
//     status: "XAC_NHAN",
//     color: "#17A2B8",
//     title: "Xác nhận",
//     icon: <MdOutlineConfirmationNumber />,
//   },
//   {
//     id: 3,
//     name: "Chờ vận chuyển",
//     status: "CHO_VAN_CHUYEN",
//     color: "#FD7E14",
//     title: "Chờ vận chuyển",
//     icon: <MdPayment />,
//   },
//   {
//     id: 4,
//     name: "Vận chuyển",
//     status: "VAN_CHUYEN",
//     color: "#28A745",
//     title: "Vận chuyển",
//     icon: <FaTruck />,
//   },
//   {
//     id: 5,
//     name: "Thanh toán",
//     status: "DA_THANH_TOAN",
//     color: "#20C997",
//     title: "Đã thanh toán",
//     icon: <FaTruckLoading />,
//   },
//   {
//     id: 6,
//     name: "Thành công",
//     status: "THANH_CONG",
//     color: "#218838",
//     title: "Thành công",
//     icon: <GiConfirmed />,
//   },
//   {
//     id: 7,
//     name: "Đã hủy",
//     status: "DA_HUY",
//     color: "#DC3545",
//     title: "Đã hủy",
//     icon: <MdOutlineCancelPresentation />,
//   },
//   {
//     id: 10,
//     name: "Trả hàng",
//     status: "TRA_HANG",
//     color: "#138496",
//     title: "Trả hàng",
//     icon: <MdOutlineChangeCircle />,
//   },
//   {
//     id: 8,
//     name: "Yêu cầu hủy",
//     status: "YEU_CAU_HUY",
//     color: "#FF4500",
//     title: "Yêu cầu hủy",
//     icon: <MdCancel />,
//   },
//   {
//     id: 9,
//     name: "Đặt lại",
//     status: "DAT_LAI",
//     color: "#6A5ACD",
//     title: "Đặt lại",
//     icon: <MdOutlineReplayCircleFilled />,
//   },
// ];

// const OrderHistory: React.FC<{
//   billHistory: Array<{
//     status: string;
//     actionDescription: string;
//     createdAt: string;
//   }>;
//   listStatus: Array<{
//     status: string;
//     icon: React.ReactNode;
//     color: string;
//     title: string;
//   }>;
// }> = ({ billHistory, listStatus }) => {
//   return (
//     <Card
//       style={{ marginTop: '20px', backgroundColor: 'white' }}
//       className="shadow-md"
//     >
//       <Title level={5} className="text-center">
//         Lịch sử đơn hàng
//       </Title>

//       <div className="container overflow-x-auto mb-3">
//         <Timeline
//           pending
//           className="custom-timeline"
//           style={{ height: '400px', overflowY: 'auto' }}
//         >
//           {billHistory.map((item, index) => {
//             const statusInfo = listStatus.find(
//               (status) => status.status === item.status
//             );

//             return (
//               <Timeline.Item
//                 key={index}
//                 dot={statusInfo?.icon || <ClockCircleOutlined />}
//                 color={statusInfo?.color || 'gray'}
//               >
//                 <h6 className="mt-2 text-lg font-semibold">
//                   {statusInfo?.title || 'Không xác định'}
//                 </h6>
//                 {formatNote(item.actionDescription)}
//                 <div className="mt-2 text-sm text-gray-500">
//                   <FormatDate date={item.createdAt} />
//                 </div>
//               </Timeline.Item>
//             );
//           })}
//         </Timeline>
//       </div>
//     </Card>
//   );
// };

// export default OrderHistory;

import React from 'react';
import { Card, Typography, Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const FormatDate = ({ date }: { date: string }) => {
  const formattedDate = new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return <span>{formattedDate}</span>;
};

const formatNote = (note: string) => {
  return <p className="text-gray-600">{note}</p>;
};



interface OrderStatusTimelineProps {
  billHistory: { status: string; actionDescription: string; createdAt: string }[];
  listStatus: { status: string; icon: React.ReactNode; color: string; title: string }[];
}

const OrderStatusTimelineV2: React.FC<OrderStatusTimelineProps> = ({ billHistory, listStatus }) => {
  return (
    <Card className="shadow-md" style={{ marginTop: '20px', backgroundColor: 'white' }}>
      <Title level={5} className="text-center">
        Lịch sử đơn hàng
      </Title>
      <div className="container overflow-x-auto mb-3">
        <Timeline pending className="custom-timeline" style={{ height: '400px', overflowY: 'auto' }}>
          {billHistory.map((item, index) => {
            const statusInfo = listStatus.find((status) => status.status === item.status);
            return (
              <Timeline.Item
                key={index}
                dot={statusInfo?.icon || <ClockCircleOutlined />}
                color={statusInfo?.color || 'gray'}
              >
                <h6 className="mt-2 text-lg font-semibold">{statusInfo?.title || 'Không xác định'}</h6>
                {formatNote(item.actionDescription)}
                <div className="mt-2 text-sm text-gray-500">
                  <FormatDate date={item.createdAt} />
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    </Card>
  );
};

export default OrderStatusTimelineV2;