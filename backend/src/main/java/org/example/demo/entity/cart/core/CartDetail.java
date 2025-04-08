package org.example.demo.entity.cart.core;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.product.core.ProductDetail;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "cart_detail", uniqueConstraints = @UniqueConstraint(columnNames = {"code"}))
public class CartDetail extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "productDetail_id")
    private ProductDetail productDetail;

//    @Column(name = "discount_event")
//    private Double discountEventPercent;
//
//    @Column(name = "event_code")
//    private String eventCode;
//
//    @Column(name = "discount_voucher")
//    private Double discountVoucherPercent;
//
//    @Column(name = "voucher_code")
//    private String voucherCode;
}
