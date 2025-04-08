package org.example.demo.service.token;

import lombok.RequiredArgsConstructor;
import org.example.demo.components.JwtTokenUtils;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.ExpiredTokenException;
import org.example.demo.repository.security.TokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService implements  ITokenService{

    private static final int MAX_TOKENS = 3;

    @Value("${jwt.expiration}")
    private int expiration; //save to an environment variable

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final TokenRepository tokenRepository;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    @Transactional
    public TokenRecord addToken(Account account, String token, boolean isMobileDevice) {
        List<TokenRecord> userTokenRecords = tokenRepository.findByAccount(account);
        int tokenCount = userTokenRecords.size();
        // neu so luong token vuot qua gioi han , xoa 1 token cu
        if (tokenCount >= MAX_TOKENS) {
            //kiểm tra xem trong danh sách userTokens có tồn tại ít nhất
            //một token không phải là thiết bị di động (non-mobile)
            boolean hasNonMobileToken = !userTokenRecords.stream().allMatch(TokenRecord::isMobile);
            TokenRecord tokenRecordToDelete;
            if (hasNonMobileToken) {
                tokenRecordToDelete = userTokenRecords.stream()
                        .filter(userToken -> !userToken.isMobile())
                        .findFirst()
                        .orElse(userTokenRecords.get(0));
            } else {
                //tất cả các token đều là thiết bị di động,
                //chúng ta sẽ xóa token đầu tiên trong danh sách
                tokenRecordToDelete = userTokenRecords.get(0);
            }
            tokenRepository.delete(tokenRecordToDelete);
        }long expirationInSeconds = expiration;
        LocalDateTime expirationDateTime = LocalDateTime.now().plusSeconds(expirationInSeconds);
        // Tạo mới một token cho người dùng
        TokenRecord newTokenRecord = TokenRecord.builder()
                .token(token)
                .revoked(false)
                .expired(false)
                .tokenType("Bearer")
                .expirationDate(expirationDateTime)
                .isMobile(isMobileDevice)
                .build();

        newTokenRecord.setRefreshToken(UUID.randomUUID().toString());
        newTokenRecord.setRefreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken));
        tokenRepository.save(newTokenRecord);
        return newTokenRecord;
    }

    @Override
    @Transactional
    public TokenRecord refreshToken(String refresh, Account account) throws Exception {
        TokenRecord existingTokenRecord = tokenRepository.findByRefreshToken(refresh);
        if (existingTokenRecord == null) {
            throw  new DataNotFoundException("Refresh token does not exist");
        }
        if(existingTokenRecord.getRefreshExpirationDate().compareTo(LocalDateTime.now()) < 0) {
            tokenRepository.delete(existingTokenRecord);
            throw  new ExpiredTokenException("Refresh token is expired");
        }
        String token = jwtTokenUtils.generateToken(account);
        LocalDateTime expirationDateTime = LocalDateTime.now().plusSeconds(expiration);
        existingTokenRecord.setExpirationDate(expirationDateTime);
        existingTokenRecord.setToken(token);
        existingTokenRecord.setRefreshToken(UUID.randomUUID().toString());
        existingTokenRecord.setRefreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken));
        return existingTokenRecord;
    }
}
