package org.example.demo.dto.compare;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailValueCompare {
    private double unitPrice;
    private double discountEvent;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDetailValueCompare that = (OrderDetailValueCompare) o;
        return Double.compare(that.unitPrice, unitPrice) == 0 &&
               Double.compare(that.discountEvent, discountEvent) == 0;
    }

    @Override
    public int hashCode() {
        return Double.hashCode(unitPrice) * 31 + Double.hashCode(discountEvent);
    }
}
