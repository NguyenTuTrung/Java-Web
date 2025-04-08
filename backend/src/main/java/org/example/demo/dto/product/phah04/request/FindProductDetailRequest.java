package org.example.demo.dto.product.phah04.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Builder
public class FindProductDetailRequest extends PageableRequest{
    private Long id;
    private String product;
    private String color;
    private String size;
    private List<String> products;
    private List<String> colors;
    private List<String> sizes;
    private Boolean deleted;
    private String name;
}
