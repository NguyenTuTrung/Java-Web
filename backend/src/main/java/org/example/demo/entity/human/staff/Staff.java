package org.example.demo.entity.human.staff;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.security.Account;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "staff", uniqueConstraints = @UniqueConstraint(columnNames = {"code", "email", "phone"}))
public class Staff extends BaseEntity {
    @Column(name = "code")
    private String code;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "citizen_id")
    private String citizenId;

    @Column(name = "address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "province", columnDefinition = "NVARCHAR(255)")
    private String province;

    @Column(name = "district", columnDefinition = "NVARCHAR(255)")
    private String district;

    @Column(name = "ward", columnDefinition = "NVARCHAR(255)")
    private String ward;

    @Column(name = "status")
    private String status;

    @Column(name = "note", columnDefinition = "NVARCHAR(255)")
    private String note;

    @Column(name = "birth_day")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDay;

    @Column(name = "deleted")
    private Boolean deleted = false;

    @Column(name = "gender")
    private Boolean gender;

    @OneToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;

}
