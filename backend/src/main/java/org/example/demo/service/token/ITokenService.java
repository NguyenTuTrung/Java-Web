package org.example.demo.service.token;

import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;

public interface ITokenService {
    TokenRecord addToken(Account account, String token, boolean isMobileDevice);

    TokenRecord refreshToken(String refresh, Account account) throws Exception;
}
