package org.example.demo.repository.cart;

import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    List<CartDetail> findByCartId(Integer idCart);
    CartDetail findByCartIdAndProductDetailId(Integer cartId, Integer productDetailId);
}
