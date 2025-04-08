package org.example.demo.entity.product.properties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.event.Event;
import org.example.demo.util.event.EventUtil;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Product extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "deleted")
    private Boolean deleted;

    @ManyToMany(mappedBy = "products")
    private List<Event> events = new ArrayList<>();

    @Transient
    private Double nowAverageDiscountPercentEvent;

    public List<Event> getEvents() {
        return events.stream()
                .filter(event -> event.getStartDate().isBefore(event.getEndDate()) // startDate < endDate
                        && event.getStartDate().isBefore(LocalDateTime.now())     // startDate <= hôm nay
                        && event.getEndDate().isAfter(LocalDateTime.now())       // endDate >= hôm nay
                        && event.getQuantityDiscount() > 0)                      // số lượng giảm giá > 0
                .sorted(Comparator.comparing(Event::getDiscountPercent).reversed()) // Sắp xếp giảm dần theo % giảm giá
                .toList();
    }

    public List<Event> getValidEvents() {
        return events.stream()
                .filter(event -> event.getStartDate().isBefore(event.getEndDate()) // startDate < endDate
                        && event.getStartDate().isBefore(LocalDateTime.now())     // startDate <= hôm nay
                        && event.getEndDate().isAfter(LocalDateTime.now())       // endDate >= hôm nay
                        && event.getQuantityDiscount() > 0)                      // số lượng giảm giá > 0
                .sorted(Comparator.comparing(Event::getDiscountPercent).reversed()) // Sắp xếp giảm dần theo % giảm giá
                .toList();
    }

    public Double getNowAverageDiscountPercentEvent() {
        return EventUtil.getAveragePercentEvent(getValidEvents());

    }
}
