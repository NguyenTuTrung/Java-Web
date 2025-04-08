package org.example.demo.service.cart;

import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.repository.cart.CartDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartDetailServiceImpl implements  CartDetailService{

    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Override
    public Boolean deleteCartDetail(Integer id) {
        cartDetailRepository.deleteById(id);
        return true;
    }

    @Override
    public String changeQuantity(CartRequestDTO cartRequestDTO) {
        CartDetail cartDetail = cartDetailRepository.findById(cartRequestDTO.getId()).orElse(null);
        cartDetail.setQuantity(cartRequestDTO.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "Thành Công";
    }
}
