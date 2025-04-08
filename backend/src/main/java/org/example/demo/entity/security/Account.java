package org.example.demo.entity.security;

import jakarta.persistence.*;
import lombok.*;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.human.staff.Staff;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "account", uniqueConstraints = @UniqueConstraint(columnNames = {"code", "email", "phone"}))
@Builder
public class Account extends BaseEntity  implements UserDetails {

    @Column(unique = true)
    private String username;

    private String password;

    private String status;

    private Boolean enabled;

    private String provider;

    private String socialId;

    @ManyToOne
    private Role role;

    @OneToOne(mappedBy = "account")
    private Staff staff;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private Customer customer;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.getName().toUpperCase()));
        return authorities;
    }

    @Override
    public String getUsername() {
        if (staff != null) {
            return staff.getEmail();  // Lấy email từ Staff
        } else if (customer != null) {
            return customer.getEmail();  // Lấy email từ Customer
        }
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }


}
