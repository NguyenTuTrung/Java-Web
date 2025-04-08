package org.example.demo.util;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyFormat {
    public static String format(double amount) {
        DecimalFormat decimalFormat = new DecimalFormat("#,###");
        String formattedAmount = decimalFormat.format(amount);

        System.out.println("Giá tiền (VN): " + formattedAmount);
        return formattedAmount;
    }
}
