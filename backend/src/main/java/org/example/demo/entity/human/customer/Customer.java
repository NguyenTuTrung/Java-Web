package org.example.demo.entity.human.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.security.Account;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "customer", uniqueConstraints = @UniqueConstraint(columnNames = {"code", "email", "phone"}))
public class Customer extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "email", columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "gender", columnDefinition = "NVARCHAR(255)")
    private String gender;

    @Column(name = "status")
    private String status;

    @Column(name = "deleted")
    private Boolean deleted = false;

    @Column(name = "birth_date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    private List<Address> addresses;

    @OneToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;
}
