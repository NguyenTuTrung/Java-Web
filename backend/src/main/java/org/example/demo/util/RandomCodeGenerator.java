package org.example.demo.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class RandomCodeGenerator {

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int STR_LENGTH = 3;
    private static final int NUM_LENGTH = 2;

    public String generateRandomCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        // Random 4 chữ cái
        for (int i = 0; i < STR_LENGTH; i++) {
            code.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }

        // Random 2 chữ số
        for (int i = 0; i < NUM_LENGTH; i++) {
            code.append(random.nextInt(10)); // Random số từ 0 đến 9
        }

        return code.toString();
    }
}
