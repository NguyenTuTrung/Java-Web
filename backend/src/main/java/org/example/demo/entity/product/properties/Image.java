package org.example.demo.entity.product.properties;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.product.core.ProductDetail;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "image", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Image extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "url")
    private String url;

    @Column(name = "deleted")
    private Boolean deleted;

    // @JsonBackReference giúp tránh vòng lặp vô tận khi trả về JSON từ ProductDetail
    @JsonBackReference
    @ManyToMany(mappedBy = "images")
    private List<ProductDetail> productDetails;

    // Cập nhật phương thức toString() để tránh vòng lặp đệ quy
    @Override
    public String toString() {
        return "Image{" +
                "code='" + code + '\'' +
                ", url='" + url + '\'' +
                ", deleted=" + deleted +
                '}';
    }
}
