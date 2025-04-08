package org.example.demo.util.voucher;

import lombok.extern.slf4j.Slf4j;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.service.voucher.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class VoucherUtil {
    @Autowired
    private VoucherService voucherService;

    public Voucher getBestVoucherCanUse(Order order) {
        double subTotal = order.getSubTotal();
        Customer customer = order.getCustomer();
//        Pageable pageable = PageRequest.of(0, 1);
        List<Voucher> voucherList = voucherService.selectPageActiveAndAbleToUseVoucher(null, null, customer != null ? customer.getId() : null, null).getContent();
        log.info("TOTAL VOUCHER FOUND: " + voucherList.size());
        List<Voucher> voucherValidList = voucherList.stream().filter(s -> s.getMinAmount() <= subTotal).collect(Collectors.toList());
        if (voucherValidList.isEmpty()) {
            return null;
        } else {
            voucherValidList.sort((voucher1, voucher2) -> Double.compare(voucher2.getMaxPercent(), voucher1.getMaxPercent()));
            log.info("TOTAL VOUCHER VALID FOUND: " + voucherValidList.size());
            voucherValidList.forEach(s -> {
                double saleAmount = (double) s.getMaxPercent() / 100 * subTotal;
                saleAmount = subTotal > s.getMinAmount() ? saleAmount : 0.0;
                System.out.println(s.getCode() + " - PERCENT: " + s.getMaxPercent() + " - MIN AMOUNT: " + s.getMinAmount() + " - QUANTITY: " + s.getQuantity() + " - SALE AMOUNT: " + saleAmount);
            });
            return voucherValidList.get(0);
        }
    }
}
