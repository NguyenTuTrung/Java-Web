package org.example.demo.util;

import java.text.Normalizer;

public class StringUtils {

    // Hàm loại bỏ dấu và ký tự đặc biệt
    public static String removeDiacriticsAndSpecialChars(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        // Chuẩn hóa chuỗi và loại bỏ dấu
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String withoutDiacritics = normalized.replaceAll("\\p{M}", ""); // Loại bỏ dấu

        // Loại bỏ ký tự đặc biệt, chỉ giữ lại chữ cái và số
        return withoutDiacritics.replaceAll("[^a-zA-Z0-9 ]", "");
    }

    public static void main(String[] args) {
        String test = "Hà Nội, 1000 năm văn hiến! Cảm ơn @ bạn.";
        String result = removeDiacriticsAndSpecialChars(test);
        System.out.println("Original: " + test);
        System.out.println("Processed: " + result);
    }
}