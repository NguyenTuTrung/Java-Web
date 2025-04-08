package org.example.demo.entity.human.customer;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.hibernate.annotations.BatchSize;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "address")
public class Address extends BaseEntity {

    @Column(name = "phone")
    private String phone;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "province_id")
    private String provinceId;

    @Column(name = "province", columnDefinition = "NVARCHAR(255)")
    private String province;

    @Column(name = "district_id")
    private String districtId;

    @Column(name = "district", columnDefinition = "NVARCHAR(255)")
    private String district;

    @Column(name = "ward_id")
    private String wardId;

    @Column(name = "ward", columnDefinition = "NVARCHAR(255)")
    private String ward;

    @Column(name = "detail", columnDefinition = "NVARCHAR(255)")
    private String detail;

    @Column(name = "is_default")
    private Boolean defaultAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
