package org.example.demo.service.auth;

import org.example.demo.dto.auth.request.VerificationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {
    private final Map<String, VerificationToken> verificationTokens = new ConcurrentHashMap<>();

    public String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void saveVerificationCode(String email, String code) {
        VerificationToken token = new VerificationToken(
                code,
                LocalDateTime.now().plusMinutes(15) // Hết hạn sau 15 phút
        );
        verificationTokens.put(email, token);
    }

    public boolean validateVerificationCode(String email, String code) {
        VerificationToken token = verificationTokens.get(email);
        return token != null &&
                token.getCode().equals(code) &&
                token.getExpiryTime().isAfter(LocalDateTime.now());
    }

    public void invalidateVerificationCode(String email) {
        verificationTokens.remove(email);
    }
}