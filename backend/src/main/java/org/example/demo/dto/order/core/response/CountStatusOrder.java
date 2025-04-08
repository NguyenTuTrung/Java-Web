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
public class CountStatusOrder {
    private Long countAll = 0L;
    private Long countPending = 0L;
    private Long countToShip = 0L;
    private Long countToReceive = 0L;
    private Long countDelivered = 0L;
    private Long countCancelled = 0L;
}
