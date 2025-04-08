//package org.example.demo.entity.payment;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.EqualsAndHashCode;
//import lombok.NoArgsConstructor;
//import org.example.demo.entity.BaseEntity;
//import org.example.demo.entity.order.core.Order;
//import org.hibernate.annotations.Nationalized;
//
//import java.math.BigDecimal;
//
//@AllArgsConstructor
//@NoArgsConstructor
//@EqualsAndHashCode(callSuper = true)
//@Data
//@Entity
//@Table(name = "payment", uniqueConstraints = @UniqueConstraint(columnNames = {"code"}))
//public class Payment extends BaseEntity {
//
//    @Column(name = "code")
//    private String code;
//
//    /**
//     * Edit Relationship.
//     *
//     * @author ngochungsoftware
//     * Add  properties, mapping Relationship  =))
//     **/
//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private Order order;
//    @Column(name = "method")
//    private Integer method;
//    @Column(name = "total_money")
//    private Double totalMoney;
//    @Nationalized
//    @Column(name = "note")
//    private String note;
//    @Nationalized
//    @Column(name = "trading_code")
//    private String tradingCode;
//    private Boolean type;
//
//}
