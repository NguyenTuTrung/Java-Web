package org.example.demo.util.caculate;

import org.example.demo.entity.event.Event;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.util.number.NumberUtil;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public class CalculateUtil {

    public static double calculatePriceOneOrderDetailNow(OrderDetail orderDetail){
        ProductDetail productDetail = orderDetail.getProductDetail();
        int quantity = orderDetail.getQuantity();
        double finalPrice = productDetail.getPrice() / 100 * averageDiscountPercentEventNow(productDetail);
        return finalPrice * quantity;
    }

    public static double averageDiscountPercentEventNow(ProductDetail productDetail){
        List<Event> events = productDetail.getProduct().getEvents().stream()
                    .filter(event -> event.getStartDate().isBefore(event.getEndDate()) // startDate < endDate
                            && event.getStartDate().isBefore(LocalDateTime.now())     // startDate <= hôm nay
                            && event.getEndDate().isAfter(LocalDateTime.now())       // endDate >= hôm nay
                            && event.getQuantityDiscount() > 0)
                    .sorted(Comparator.comparing(Event::getDiscountPercent).reversed())
                    .toList();

        return events.stream()
                .mapToInt(Event::getDiscountPercent)
                .average()
                .orElse(0.0);
    }

    public static double getRefund(Order order){
        double subtotal = order.getSubTotal();
        double discount = order.getDiscount();
        double fee_ship = order.getDeliveryFee();
        double total_paid = order.getTotalPaid();
        boolean isPayment = order.getIsPayment();


        double total_after_discount_and_fee = subtotal - discount + fee_ship;
        // tính tiền trả lại
        double range = total_paid - total_after_discount_and_fee;
        return range >= 0 && isPayment ? NumberUtil.roundDouble(range) : 0.0;
    }

    public static double getSurcharge(Order order) {
        double subtotal = order.getSubTotal();
        double discount = order.getDiscount();
        double fee_ship = order.getDeliveryFee();
        double total_paid = order.getTotalPaid();
        boolean isPayment = order.getIsPayment();

        double total_after_discount_and_fee = subtotal - discount + fee_ship;
        double range = total_after_discount_and_fee - total_paid;
        return range >= 0 && isPayment ? NumberUtil.roundDouble(range) : 0.0;
    }

}
