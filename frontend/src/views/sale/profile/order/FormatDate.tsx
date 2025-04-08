import React from "react";

interface FormatDateProps {
  date: string; 
}

const FormatDate: React.FC<FormatDateProps> = ({ date }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    return date.toLocaleString("vi-VN", options);
  };

  return <span>{formatDate(date)}</span>;
};

export default FormatDate;
