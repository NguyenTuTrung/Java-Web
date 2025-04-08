package org.example.demo.controller.cart;

import org.example.demo.dto.cart.request.CreateCartDetailDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.cart.response.CartDetailResponseMapper;
import org.example.demo.repository.cart.CartDetailRepository;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.cart.CartServiceV2;
import org.example.demo.util.RandomCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "cart-details")
public class CartDetailController {
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private CartDetailResponseMapper cartDetailResponseMapper;

    @Autowired
    private CartServiceV2 cartServiceV2;


    @GetMapping("/in-cart/{id}")
    public ResponseEntity<?> getAllCartDetailsByCartId(@PathVariable("id") Integer id) {
        List<CartDetail> cartDetailList = cartDetailRepository.findByCartId(id);
        return ResponseEntity.ok(cartDetailResponseMapper.toListDTO(cartDetailList));
    }

    @GetMapping(value = "quantity/update/{integer}")
    public ResponseEntity<?> updateQuantity(@PathVariable Integer integer, @RequestParam(value = "quantity", required = true) Integer newQuantity) {
        return ResponseEntity.ok(cartServiceV2.updateQuantity(integer, newQuantity));
    }

    @PostMapping("create")
    public ResponseEntity<?> createCartDetail(@RequestBody CreateCartDetailDTO request) {
        return ResponseEntity.ok(cartDetailResponseMapper.toDTO(cartServiceV2.createCartDetail(request)));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeCartDetail(@PathVariable Integer id) {
        CartDetail cartDetail = cartDetailRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        cartDetailRepository.delete(cartDetail);
        return ResponseEntity.ok("Xoá sản phẩm " + cartDetail.getProductDetail().getProduct().getName() + " khỏi giỏ hàng");
    }
}
