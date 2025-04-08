package org.example.demo.repository.security;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<TokenRecord, Integer> {
//
//    List<TokenRecord> findByStaff(Staff staff);
//
//    List<TokenRecord> findByCustomer(Customer customer);

    TokenRecord findByToken(String token);

    TokenRecord findByRefreshToken(String refreshToken);

    List<TokenRecord> findByAccount(Account account);
}
