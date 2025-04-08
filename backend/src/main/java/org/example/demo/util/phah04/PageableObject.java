package org.example.demo.util.phah04;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.demo.exception.InvalidArgumentException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * The type Staff response dto.
 *
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageableObject {

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class CSort {
        private String order;
        private String key;
    }

    @NotNull(message = "NotNull")
    private String query;

    @NotNull(message = "NotNull")
    @PositiveOrZero(message = "PositiveOrZero")
    private Integer pageIndex;

    @NotNull(message = "NotNull")
    @Positive(message = "Positive")
    @Max(value = 100, message = "Max-100")
    private Integer pageSize;

    @NotNull(message = "NotNull")
    private CSort sort;

    public Pageable toPageRequest() {
        List<String> orders = List.of("asc", "desc");
        this.pageIndex -= 1;

        if (this.sort == null) {
            throw new InvalidArgumentException("InvalidArgumentException", "", "sort");
        }

        if (this.sort.order == null || this.sort.order.isEmpty()) {
            this.sort.setOrder("asc");
        }

        if (this.sort.key == null || this.sort.key.isEmpty()) {
            return PageRequest.of(this.pageIndex, this.pageSize);
        }

        if (!orders.contains(this.sort.order.toLowerCase())) {
            throw new InvalidArgumentException("InvalidArgumentException", "", "sort.order");
        }

        Sort sorted = this.sort.getOrder().equalsIgnoreCase("asc")
                ? Sort.by(this.sort.getKey()).ascending()
                : Sort.by(this.sort.getKey()).descending();

        System.out.println(sorted);
        return PageRequest.of(this.pageIndex, this.pageSize, sorted);
    }

}
