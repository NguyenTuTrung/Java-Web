package org.example.demo.entity.cart.properties;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.voucher.core.Voucher;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "cart")
public class Cart extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "province_name", columnDefinition = "NVARCHAR(255)")
    private String provinceName;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "district_name", columnDefinition = "NVARCHAR(255)")
    private String districtName;

    @Column(name = "ward_id")
    private String wardId;

    @Column(name = "ward_name", columnDefinition = "NVARCHAR(255)")
    private String wardName;

    @Column(name = "recipient_name", columnDefinition = "NVARCHAR(255)")
    private String recipientName;

    @Column(name = "phone", columnDefinition = "NVARCHAR(255)")
    private String phone;

    @Column(name = "email", columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "total")
    private Double total = 0.0;

    @Column(name = "delivery_fee")
    private Double deliveryFee = 0.0;

    @Column(name = "discount")
    private Double discount = 0.0;

    @Column(name = "sub_total")
    private Double subTotal = 0.0;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "payment")
    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @OneToMany(mappedBy = "cart")
    private List<CartDetail> cartDetails;
}
