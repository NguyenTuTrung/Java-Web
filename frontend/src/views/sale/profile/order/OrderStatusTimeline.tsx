// import React from 'react';
// import { FaRegFileAlt, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// enum Status {
//   PENDING = "PENDING",
//   TOSHIP = "TOSHIP",
//   TORECEIVE = "TORECEIVE", 
//   DELIVERED = "DELIVERED",
//   CANCELED = "CANCELED"
// }

// interface BillHistory {
//   id: number;
//   status: Status;
//   note: string;
//   createdDate: string;
//   updatedDate?: string;
// }

// interface Bill {
//   status: Status;
// }

// interface Props {
//   billHistory: BillHistory[];
//   bill: Bill;
//   onActionClick: (isCancel: boolean) => void;
// }

// const OrderStatusTimeline: React.FC<Props> = ({ billHistory, bill, onActionClick }) => {
//   // Status configuration with more descriptive details
//   const STATUS_CONFIG = {
//     [Status.PENDING]: {
//       text: 'Chờ xác nhận',
//       color: 'bg-orange-500',
//       textColor: 'text-orange-500',
//       icon: FaRegFileAlt,
//       description: 'Đơn hàng đang chờ được xác nhận'
//     },
//     [Status.TOSHIP]: {
//       text: 'Chờ giao hàng',
//       color: 'bg-blue-800',
//       textColor: 'text-blue-800',
//       icon: FaShippingFast,
//       description: 'Đơn hàng đang được chuẩn bị'
//     },
//     [Status.TORECEIVE]: {
//       text: 'Đang giao hàng',
//       color: 'bg-blue-500',
//       textColor: 'text-blue-500',
//       icon: FaShippingFast,
//       description: 'Đơn hàng đang trên đường giao'
//     },
//     [Status.DELIVERED]: {
//       text: 'Hoàn thành',
//       color: 'bg-green-500',
//       textColor: 'text-green-500',
//       icon: FaCheckCircle,
//       description: 'Đơn hàng đã được giao thành công'
//     },
//     [Status.CANCELED]: {
//       text: 'Đã hủy',
//       color: 'bg-red-500',
//       textColor: 'text-red-500',
//       icon: FaTimesCircle,
//       description: 'Đơn hàng đã bị hủy'
//     }
//   };

//   // Generate full timeline with all statuses
//   const generateFullTimeline = () => {
//     const statusOrder = [
//       Status.PENDING, 
//       Status.TOSHIP, 
//       Status.TORECEIVE, 
//       Status.DELIVERED, 
//       Status.CANCELED
//     ];

//     return statusOrder.map(status => {
//       const matchedHistory = billHistory.find(item => item.status === status);
//       const config = STATUS_CONFIG[status];

//       return {
//         status,
//         ...config,
//         date: matchedHistory?.createdDate || null,
//         note: matchedHistory?.note || null,
//         isPassed: billHistory.some(h => h.status === status)
//       };
//     });
//   };

//   const fullTimeline = generateFullTimeline();
//   const currentStatusIndex = fullTimeline.findIndex(item => item.status === bill.status);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl">
//       {/* Status Timeline */}
//       <div className="relative mb-8">
//         <div className="flex justify-between items-center">
//           {fullTimeline.map((item, index) => {
//             const Icon = item.icon;
//             const isPassed = index <= currentStatusIndex;
//             const isActive = index === currentStatusIndex;

//             return (
//               <div 
//                 key={item.status} 
//                 className="flex flex-col items-center relative w-1/5 group"
//               >
//                 {/* Status Dot */}
//                 <div 
//                   className={`
//                     w-16 h-16 rounded-full flex items-center justify-center 
//                     transition-all duration-300 ease-in-out
//                     ${isPassed ? item.color : 'bg-gray-200'}
//                     text-white mb-2 shadow-md
//                     ${isActive ? 'scale-110 ring-4 ring-opacity-50 ' + item.color : ''}
//                   `}
//                 >
//                   <Icon className="w-8 h-8" />
//                 </div>
                
//                 {/* Status Text */}
//                 <div className="text-center">
//                   <div 
//                     className={`
//                       text-sm font-semibold 
//                       ${isPassed ? item.textColor : 'text-gray-400'}
//                       transition-colors duration-300
//                     `}
//                   >
//                     {item.text}
//                   </div>
                  
//                   {item.date && isPassed && (
//                     <div className="text-xs text-gray-500 mt-1">
//                       {new Date(item.date).toLocaleString('vi-VN', {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric'
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 {/* Connecting Line */}
//                 {index < fullTimeline.length - 1 && (
//                   <div 
//                     className={`
//                       absolute top-8 left-full w-full h-1 -z-10
//                       transition-colors duration-300
//                       ${isPassed ? 'bg-green-500' : 'bg-gray-300'}
//                     `} 
//                     style={{ width: 'calc(100% + 2rem)' }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Status Description */}
//       <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
//         {fullTimeline[currentStatusIndex].description}
//         {fullTimeline[currentStatusIndex].note && (
//           <p className="text-sm text-gray-600 mt-2">
//             Ghi chú: {fullTimeline[currentStatusIndex].note}
//           </p>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4">
//         {bill.status !== Status.DELIVERED && bill.status !== Status.CANCELED && (
//           <>
//             {bill.status === Status.PENDING && (
//               <button 
//                 onClick={() => onActionClick(true)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Hủy đơn
//               </button>
//             )}
//             <button 
//               onClick={() => onActionClick(false)}
//               className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               {bill.status === Status.PENDING ? 'Xác nhận' : 'Hoàn thành'}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderStatusTimeline;

import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { FaRegFileAlt, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClipboardList } from 'react-icons/fa';

enum Status {
  PLACED = "PLACED",     // Newly added status
  PENDING = "PENDING",
  TOSHIP = "TOSHIP",
  TORECEIVE = "TORECEIVE", 
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}

interface Account {
  id: number;
  username: string;
  customer?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
}

interface BillHistory {
  id: number;
  status: Status;
  note: string;
  createdDate: string;
  updatedDate?: string;
  account: Account;
}

interface Bill {
  status: Status;
}

interface Props {
  billHistory: BillHistory[];
  bill: Bill;
  onActionClick: (isCancel: boolean) => void;
}

const OrderStatusTimeline: React.FC<Props> = ({ billHistory, bill, onActionClick }) => {

  
  const STATUS_CONFIG = {
    [Status.PLACED]: {
      text: 'Đơn hàng đã đặt',
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      icon: FaClipboardList,
      description: 'Đơn hàng đã được tạo và chờ xử lý'
    },
    [Status.PENDING]: {
      text: 'Chờ xác nhận',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      icon: FaRegFileAlt,
      description: 'Đơn hàng đang chờ được xác nhận'
    },
    [Status.TOSHIP]: {
      text: 'Chờ giao hàng',
      color: 'bg-blue-800',
      textColor: 'text-blue-800',
      icon: FaShippingFast,
      description: 'Đơn hàng đang được chuẩn bị'
    },
    [Status.TORECEIVE]: {
      text: 'Đang giao hàng',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      icon: FaShippingFast,
      description: 'Đơn hàng đang trên đường giao'
    },
    [Status.DELIVERED]: {
      text: 'Hoàn thành',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      icon: FaCheckCircle,
      description: 'Đơn hàng đã được giao thành công'
    },
    [Status.CANCELED]: {
      text: 'Đã hủy',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      icon: FaTimesCircle,
      description: 'Đơn hàng đã bị hủy'
    }
  };

  // Generate full timeline with all statuses
  const generateFullTimeline = () => {
    const statusOrder = [
      Status.PLACED,    // Added new status first in the order
      Status.PENDING, 
      Status.TOSHIP, 
      Status.TORECEIVE, 
      Status.DELIVERED, 
      Status.CANCELED
    ];

    return statusOrder.map(status => {
      const matchedHistory = billHistory.find(item => item.status === status);
      const config = STATUS_CONFIG[status];

      return {
        status,
        ...config,
        date: matchedHistory?.createdDate || null,
        note: matchedHistory?.note || null,
        isPassed: billHistory.some(h => h.status === status)
      };
    });
  };

  const fullTimeline = generateFullTimeline();
  const currentStatusIndex = fullTimeline.findIndex(item => item.status === bill.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Status Timeline */}
      <div className="relative mb-8">
        <div className="flex justify-between items-center">
          {fullTimeline.map((item, index) => {
            const Icon = item.icon;
            const isPassed = index <= currentStatusIndex;
            const isActive = index === currentStatusIndex;

            return (
              <div 
                key={item.status} 
                className="flex flex-col items-center relative w-1/6 group"
              >
                {/* Status Dot */}
                <div 
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center 
                    transition-all duration-300 ease-in-out
                    ${isPassed ? item.color : 'bg-gray-200'}
                    text-white mb-2 shadow-md
                    ${isActive ? 'scale-110 ring-4 ring-opacity-50 ' + item.color : ''}
                  `}
                >
                  <Icon className="w-8 h-8" />
                </div>
                
                {/* Status Text */}
                <div className="text-center">
                  <div 
                    className={`
                      text-sm font-semibold 
                      ${isPassed ? item.textColor : 'text-gray-400'}
                      transition-colors duration-300
                    `}
                  >
                    {item.text}
                  </div>
                  
                  {item.date && isPassed && (
                    <div className="text-xs text-gray-500 mt-1">
                      {/* Assuming the date is in the format "HH:mm DD-MM-YYYY" */}
                      {item.date}
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < fullTimeline.length - 1 && (
                  <div 
                    className={`
                      absolute top-8 left-full w-full h-1 -z-10
                      transition-colors duration-300
                      ${isPassed ? 'bg-green-500' : 'bg-gray-300'}
                    `} 
                    style={{ width: 'calc(100% + 2rem)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Description */}
      <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
        {fullTimeline[currentStatusIndex].description}
        {fullTimeline[currentStatusIndex].note && (
          <p className="text-sm text-gray-600 mt-2">
            Mã đơn hàng: {fullTimeline[currentStatusIndex].note}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {bill.status !== Status.DELIVERED && bill.status !== Status.CANCELED && (
          <>
            {bill.status === Status.PLACED && (
              <button 
                onClick={() => onActionClick(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Hủy đơn
              </button>
            )}
            <button 
              onClick={() => onActionClick(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              {bill.status === Status.PLACED ? 'Xác nhận' : 'Hoàn thành'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;