package org.example.demo.infrastructure.common;

import lombok.Getter;
import lombok.Setter;
import org.example.demo.infrastructure.constant.PaginationConstant;

@Getter
@Setter
public class PageableRequest {
    private int page = PaginationConstant.DEFAULT_PAGE;
    private int sizePage = PaginationConstant.DEFAULT_SIZE;
}
