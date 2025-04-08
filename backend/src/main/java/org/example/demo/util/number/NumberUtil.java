package org.example.demo.util.number;

import java.text.DecimalFormat;

public class NumberUtil {
    public static double roundDouble(double percent){
        return Math.round(percent * 100) / 100.0;
    }

    public static String formatCurrency (double number) {
        DecimalFormat decimalFormat = new DecimalFormat("#,###");
        return decimalFormat.format(number).replace(",", ".");
    }
}
