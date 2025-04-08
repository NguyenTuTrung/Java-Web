package org.example.demo.entity.security;



import jakarta.persistence.*;
import lombok.*;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;

import java.time.LocalDateTime;

/**
 * @author Hungsoftware
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "tokens")
@Entity
@Builder
public class TokenRecord extends BaseEntity {
    @Column(name = "token", length = 255, nullable = false)
    private String token;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    @Column(name = "token_type", length = 50)
    private String tokenType;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Column(name = "refresh_expiration_date", nullable = false)
    private LocalDateTime refreshExpirationDate;

    @Column(name = "is_mobile", nullable = false)
    private boolean isMobile;

    @Column(nullable = false)
    private boolean revoked;

    @Column(nullable = false)
    private boolean expired;

    @ManyToOne
    private Account account;
}
