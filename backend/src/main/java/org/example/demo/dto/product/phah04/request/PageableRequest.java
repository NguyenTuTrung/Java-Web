package org.example.demo.dto.product.phah04.request;

import lombok.Getter;
import lombok.Setter;
import org.example.demo.infrastructure.constant.PaginationConstant;

@Getter
@Setter
public abstract class PageableRequest {

    private int page = PaginationConstant.DEFAULT_PAGE;
    private int sizePage = PaginationConstant.DEFAULT_SIZE;
}