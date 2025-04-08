

import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { FaRegFileAlt, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClipboardList } from 'react-icons/fa';


const OrderStatusTimeline: React.FC<Props> = ({ billHistory, bill, onActionClick }) => {

  const fullTimeline = generateFullTimeline();
  const currentStatusIndex = fullTimeline.findIndex(item => item.status === bill.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                      {item.date}
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < fullTimeline.length - 1 && (
                  <div className="absolute top-8 -right-1/2 w-full h-0.5">
                    <div 
                      className={`
                        w-full h-full
                        transition-all duration-300 ease-in-out
                        ${isPassed && index < currentStatusIndex ? item.color : 'bg-gray-200'}
                      `}
                    />
                    {/* Gradient overlay for active status */}
                    {isActive && (
                      <div 
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                          background: `linear-gradient(to right, ${item.color.replace('bg-', '')} 0%, #E5E7EB 100%)`
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ... (giữ nguyên phần còn lại của component) */}
    </div>
  );
};

export default OrderStatusTimeline;