package org.example.demo.service.cronjob;

import org.example.demo.service.voucher.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class Cronjob {

    @Autowired
    private VoucherService voucherService;

    // Chạy job mỗi phút
    @Scheduled(cron = "0 * * * * ?")
    public void autoUpdateStatusVoucher() {
//        try {
//            voucherService.updateStatusVoucher();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }
}
