package org.example.demo.util.order;

import org.example.demo.entity.order.enums.Status;

public class OrderUtil {
    public static String getNameOfStatus(Status status) {
        switch (status) {
            case PENDING -> {
                return "Chờ xác nhận";
            }
            case TOSHIP -> {
                return "Chờ vận chuyển";
            }
            case TORECEIVE -> {
                return "Đang vận chuyển";
            }
            case DELIVERED -> {
                return "Đã nhận hàng";
            }
            case CANCELED -> {
                return "Đã hủy đơn";
            }
            default -> {
                return "Không xác định";
            }
        }
    }
}
