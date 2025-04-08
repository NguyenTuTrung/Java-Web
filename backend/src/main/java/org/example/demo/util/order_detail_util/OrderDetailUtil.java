package org.example.demo.util.order_detail_util;

import lombok.extern.slf4j.Slf4j;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.util.number.NumberUtil;

@Slf4j
public class OrderDetailUtil {
    public static Double get_current_product_detail_price(ProductDetail productDetail) {
        double productDetailPrice = productDetail.getPrice();
        double averageEventPercent = productDetail.getProduct().getNowAverageDiscountPercentEvent();
        double unitPrice = NumberUtil.roundDouble(productDetailPrice * (1 - averageEventPercent / 100));
        log.info("productDetailPrice: " +  productDetailPrice);
        log.info("averageEventPercent: " +  averageEventPercent);
        log.info("UNIT PRICE: " +  unitPrice);
        return unitPrice;
    }
}
