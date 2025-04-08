package org.example.demo.service.cart;


import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.infrastructure.common.ResponseObject;
import org.example.demo.repository.cart.CartDetailRepository;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {


    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;


    @Override
    public List<CartResponseDTO> getListCart(Integer idCustomer) {
        return  cartRepository.getListCart(idCustomer);
    }

    @Override
    @Transactional
    public ResponseObject create(CartRequestDTO requestDTO) {
        ProductDetail productDetail = productDetailRepository.findById(requestDTO.getProductDetail()).get();
        Cart cart = cartRepository.findByCustomerId(requestDTO.getId());
        if (cart == null) {
            Cart newCart = new Cart();
            newCart.setCustomer(customerRepository.findById(requestDTO.getId()).orElse(null));
            cart = cartRepository.save(newCart);
        }

        CartDetail  cartDetail = cartDetailRepository.findByCartIdAndProductDetailId(cart.getId(), requestDTO.getProductDetail());
        if (cartDetail != null) {
            if (requestDTO.getQuantity() <= 0) {
                throw  new CustomExceptions.CustomBadRequest("Số lượng phải >= 0!");
            }
            if (cartDetail.getQuantity() + requestDTO.getQuantity() > productDetail.getQuantity()) {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng sản phẩm trong kho!");
            }
            if (requestDTO.getQuantity() > 10) {
                throw new CustomExceptions.CustomBadRequest("Chỉ được mua tối đa 10 sản phẩm!");
            }
            cartDetail.setQuantity(cartDetail.getQuantity() + requestDTO.getQuantity());
            cartDetailRepository.save(cartDetail);
        } else {
            CartDetail newCartDetail = new CartDetail();
            newCartDetail.setCart(cart);
            newCartDetail.setQuantity(requestDTO.getQuantity());
            if (requestDTO.getQuantity() > productDetail.getQuantity()) {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng sản phẩm trong kho!");
            }
            newCartDetail.setProductDetail(productDetailRepository.findById(requestDTO.getProductDetail()).get());
            cartDetailRepository.save(newCartDetail);
        }
        return new ResponseObject<>(HttpStatusCode.valueOf(200), "Thành Công", null);
    }

    @Override
    @Transactional
    public ResponseObject update(CartRequestDTO requestDTO) {
        CartDetail cartDetail = cartDetailRepository.findById(requestDTO.getId()).get();
        if (requestDTO.getQuantity() <= 0) {
            throw  new CustomExceptions.CustomBadRequest("Số lượng phải >= 0!");
        }
        if (requestDTO.getQuantity() > cartDetail.getProductDetail().getQuantity()) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng sản phẩm trong kho!");
        }
        if (requestDTO.getQuantity() > 10) {
            throw new CustomExceptions.CustomBadRequest("Chỉ được mua tối đa 10 sản phẩm!");
        }
        cartDetail.setQuantity(requestDTO.getQuantity());
        cartDetailRepository.save(cartDetail);
        return new ResponseObject<>(HttpStatusCode.valueOf(200), "Thành Công", null);
    }

    @Override
    public ResponseObject deleteById(Integer idCartDetail) {
        cartDetailRepository.deleteById(idCartDetail);
        return new ResponseObject<>(HttpStatusCode.valueOf(200), "Thành Công", null);
    }

    @Override
    public ResponseObject deleteAll(Integer idCustomer) {
        Cart cart = cartRepository.findByCustomerId(idCustomer);
        List<CartDetail> cartDetailList = cartDetailRepository.findByCartId(cart.getId());
        cartDetailRepository.deleteAll(cartDetailList);
        return new ResponseObject<>(HttpStatusCode.valueOf(200), "Thành Công", null);
    }
}
