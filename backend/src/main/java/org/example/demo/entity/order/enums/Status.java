package org.example.demo.entity.order.enums;

public enum Status {
    PENDING,    // Chờ xác nhận
    TOSHIP,     // Chờ giao hàng
    TORECEIVE,  // Đang giao hàng
    DELIVERED,  // Hoàn thành
    CANCELED,   // Đã hủy
    REQUESTED,  // Yêu cầu hủy
}
