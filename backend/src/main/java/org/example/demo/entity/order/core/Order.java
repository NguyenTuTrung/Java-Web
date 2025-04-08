package org.example.demo.entity.order.core;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.voucher.core.Voucher;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "orders", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Order extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "province_id", columnDefinition = "NVARCHAR(255)")
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

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "totalPaid")
    private Double totalPaid;

    @Column(name = "discount_voucher_percent")
    private Double discountVoucherPercent;

    @Column(name = "voucher_minimum_subtotal_required")
    private Double voucherMinimumSubtotalRequired;

    @Column(name = "total")
    private Double total;

    @Column(name = "delivery_fee")
    private Double deliveryFee;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "is_payment")
    private Boolean isPayment;

    @Column(name = "in_store")
    private Boolean inStore;

    @Column(name = "sub_total")
    private Double subTotal;

    @Column(name = "is_fee_manually")
    private Boolean isFeeManually = Boolean.FALSE;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "payment")
    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @OneToMany(mappedBy = "order", orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<History> histories = new ArrayList<>();
}
