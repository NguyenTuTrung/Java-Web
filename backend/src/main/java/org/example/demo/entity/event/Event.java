package org.example.demo.entity.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "event")
@Entity
public class Event extends BaseEntity {
    @Column(name = "discount_code", unique = true)
    private String discountCode;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name; // tên sự kiện

    @Column(name = "discount_percent")
    private Integer discountPercent; // phần trăm giảm giá

    @Column(name = "start_date")
    @JsonFormat(pattern = "dd-MM-yyyy'T'HH:mm")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    @JsonFormat(pattern = "dd-MM-yyyy'T'HH:mm")
    private LocalDateTime endDate;

    @Column(name = "quantity_discount")
    private Integer quantityDiscount = 0;

    @Column(name = "status", columnDefinition = "NVARCHAR(255)")
    private String status;

    @ManyToMany
    @JoinTable(
            name = "event_product",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products = new ArrayList<>();

    public void updateStatusBasedOnTime() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("Current time: " + now); // In thời gian hiện tại
        if (now.isBefore(startDate)) {
            this.status = "Sắp diễn ra";
        } else if (now.isAfter(endDate)) {
            this.status = "Đã kết thúc";
        } else {
            this.status = "Đang diễn ra";
        }
        System.out.println("Updated status: " + this.status); // In trạng thái đã cập nhật
    }
}
