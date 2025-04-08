package org.example.demo.dto.product.requests.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ImageRequestDTO {
    private String code;
    private String url; // Dùng MultipartFile để nhận ảnh từ frontend
    private Boolean deleted;



}
