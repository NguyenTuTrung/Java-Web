package org.example.demo.dto.order.core.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created time 9/29/2024 18:07
 * The type Staff response dto.
 *
 * @author PHAH04
 * Vui lòng ......
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CountOrderDetailInOrder {
    private Integer idOrder;
    private Long countOrderDetail;
    private String code;
}
