package org.example.demo.entity.order.properties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.util.event.EventUtil;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "order_detail")
public class OrderDetail extends BaseEntity {

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "productDetail_id")
    private ProductDetail productDetail;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "unitPrice")
    private Double unitPrice;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "average_discount_event")
    private Double averageDiscountEventPercent;

    public Double getAverageDiscountEventPercent() {
        return EventUtil.roundPercent(averageDiscountEventPercent);
    }
}
