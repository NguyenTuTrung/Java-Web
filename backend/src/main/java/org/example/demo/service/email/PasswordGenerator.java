package org.example.demo.service.email;
import java.security.SecureRandom;
import java.util.Locale;
import java.util.Objects;
import java.util.Random;

public class PasswordGenerator {
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPER = LOWER.toUpperCase(Locale.ROOT);
    private static final String DIGITS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()-_+=<>?/[]{}|";
    private static final String ALL_CHARS = LOWER + UPPER + DIGITS + SYMBOLS;
    private static final Random RANDOM = new SecureRandom();

    public static String generatePassword(int length) {
        if (length < 8) throw new IllegalArgumentException("Password must be at least 8 characters long");

        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(ALL_CHARS.charAt(RANDOM.nextInt(ALL_CHARS.length())));
        }

        return password.toString();
    }
}
