import React from 'react';



const FormatCurrency = ({ value }) => {
  // Chuyển đổi giá trị thành định dạng tiền tệ VND
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);

  return <span>{formattedValue}</span>;
};

export default FormatCurrency;