package org.example.demo.repository.cart;

import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.cart.properties.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    @Query(value = """
            SELECT
            s.id AS productId,
            cd.id AS cartDetailId,
            s.name AS productName,
            c.name AS colorName,
            sz.name AS sizeName,
            sd.id AS productDetailId,
            cd.quantity AS cartQuantity,
            sd.price AS productPrice,
            (
                SELECT TOP 1 img.name
         FROM image img
         WHERE img.id = sd.image_id
         ORDER BY img.name ASC) AS imageName
        FROM cart_detail cd
        LEFT JOIN cart ct ON cd.cart_id = ct.id
        LEFT JOIN product_detail sd ON sd.id = cd.product_detail_id
        LEFT JOIN color c ON c.id = sd.color_id
        LEFT JOIN size sz ON sz.id = sd.size_id
        LEFT JOIN product s ON s.id = sd.product_id
        WHERE ct.customer_id = :idCustomer
    """, nativeQuery = true)
    List<CartResponseDTO> getListCart(@Param("idCustomer") Integer idCustomer);

    Cart findByCustomerId(Integer customerId);

    Cart findByIdAndDeleted(Integer id, Boolean deleted);

    Cart findByCode(String code);
}
