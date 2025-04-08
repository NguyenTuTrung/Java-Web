package org.example.demo.service.cart;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.request.CartRequestDTOV2;
import org.example.demo.dto.cart.request.CreateCartDetailDTO;
import org.example.demo.dto.ghn.FeeDTO;
import org.example.demo.dto.ghn.ItemDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.cart.CartDetailRepository;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.fee.FeeService;
import org.example.demo.util.CurrencyFormat;
import org.example.demo.util.DataUtils;
import org.example.demo.util.auth.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CartServiceV2 {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FeeService feeService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Value("${custom.subtotal.allow.free.ship}")
    private Double subTotalAllowFreeShip;

    @Value("${custom.subtotal.allow.maximum}")
    private Double subTotalAllowMaximum;


    @Transactional
    public CartDetail createCartDetail(CreateCartDetailDTO request) {
        Cart cart = cartRepository.findById(request.getCartId()).orElse(null);
        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId()).orElse(null);
        if (cart == null) {
            throw new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng");
        }
        if (productDetail == null) {
            throw new CustomExceptions.CustomBadRequest("Không tìm thấy sản phẩm này");
        }
        //
        int productDetailQuantity = productDetail.getQuantity();
        CartDetail cartDetail = cartDetailRepository.findByCartIdAndProductDetailId(request.getCartId(), request.getProductDetailId());
        if (cartDetail != null) {
            // check quantity
            if (productDetailQuantity >= cartDetail.getQuantity() + request.getQuantity()) {
                cartDetail.setQuantity(cartDetail.getQuantity() + request.getQuantity());
            } else {
                throw new CustomExceptions.CustomBadRequest("#87SDE Không đủ số lượng đáp ứng");
            }
        } else {
            cartDetail = new CartDetail();
            cartDetail.setProductDetail(productDetail);
            cartDetail.setCart(cart);
            // check quantity
            if (productDetailQuantity >= request.getQuantity()) {
                cartDetail.setQuantity(request.getQuantity());
            } else {
                throw new CustomExceptions.CustomBadRequest("#76DSG Không đủ số lượng đáp ứng");
            }
        }
        CartDetail cartDetailResult = cartDetailRepository.save(cartDetail);
        reloadSubTotalOrder(cart);
        return cartDetailResult;
    }


    @Transactional
    public CartDetail updateQuantity(Integer cartId, Integer newQuantity) {
        CartDetail cartDetail = cartDetailRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        int quantityInStorage = cartDetail.getProductDetail().getQuantity();
        int oldQuantity = cartDetail.getQuantity();

        if (newQuantity > oldQuantity && newQuantity > quantityInStorage) {
            throw new CustomExceptions.CustomBadRequest("#989SD Không đủ số lượng đáp ứng");
        } else if (newQuantity == 0) {
            cartDetailRepository.delete(cartDetail);
            reloadSubTotalOrder(cartDetail.getCart());
            return cartDetail;
        } else {
            cartDetail.setQuantity(newQuantity);
            reloadSubTotalOrder(cartDetail.getCart());
            return cartDetailRepository.save(cartDetail);
        }
    }

    public void calculateDiscount(Cart cart) {
        Voucher voucher = cart.getVoucher();
        Double total = fetchTotal(cart);
        if (voucher != null) {
            if (total >= voucher.getMinAmount()) {
                double discount = total / 100 * voucher.getMaxPercent();
                cart.setDiscount(discount);
            }
        }
    }


    @Transactional
    public Cart update(Integer id, CartRequestDTOV2 requestDTO) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));
        String address = "";
        // update customer
        Account account = AuthUtil.getAccount();
        if (account != null) {
            cart.setCustomer(account.getCustomer());
        }

        System.out.println();
        // update voucher
        if (requestDTO.getVoucher() != null) {
            if (requestDTO.getVoucher().getId() != null) {
                Voucher selectedVoucher = voucherRepository.findById(requestDTO.getVoucher().getId()).orElse(null);
                if (selectedVoucher != null) {
                    cart.setVoucher(selectedVoucher);
                }
            }
        }
        // payment
        if (requestDTO.getPayment() != null) {
            cart.setPayment(requestDTO.getPayment());
        }
        // type
        if (requestDTO.getType() != null) {
            cart.setType(requestDTO.getType());
        }
        // type
        if (requestDTO.getStatus() != null) {
            cart.setStatus(requestDTO.getStatus());
        }
        // address
        if (requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())) {
            address += requestDTO.getAddress();
        }
        // ward
        if (requestDTO.getWardId() != null && !DataUtils.isNullOrEmpty(requestDTO.getWardName())) {
            cart.setWardName(requestDTO.getWardName());
            cart.setWardId(requestDTO.getWardId());
            address += ", " + requestDTO.getWardName();
        }
        // district
        if (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) {
            cart.setDistrictName(requestDTO.getDistrictName());
            cart.setDistrictId(requestDTO.getDistrictId());
            address += ", " + requestDTO.getDistrictName();
        }
        // province
        if (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) {
            cart.setProvinceName(requestDTO.getProvinceName());
            cart.setProvinceId(requestDTO.getProvinceId());
            address += ", " + requestDTO.getProvinceName();
        }
        // phone
        if (requestDTO.getPhone() != null && !DataUtils.isNullOrEmpty(requestDTO.getPhone())) {
            cart.setPhone(requestDTO.getPhone());
        }
        // recipientName;
        if (requestDTO.getRecipientName() != null && !DataUtils.isNullOrEmpty(requestDTO.getRecipientName())) {
            cart.setRecipientName(requestDTO.getRecipientName());
        }
        if (requestDTO.getEmail() != null && !DataUtils.isNullOrEmpty(requestDTO.getEmail())) {
            cart.setEmail(requestDTO.getEmail());
        }
        // set address
        if (!DataUtils.isNullOrEmpty(address)) {
            cart.setAddress(requestDTO.getAddress());
        }
        // return order
        reloadSubTotalOrder(cart);
        return cartRepository.save(cart);
    }


    @Transactional
    public void reloadSubTotalOrder(Cart cart) {
        Double subTotal = fetchTotal(cart);
        cart.setSubTotal(subTotal);
        calculateDiscount(cart);
        if(subTotal > subTotalAllowMaximum){
            throw new CustomExceptions.CustomBadRequest(String.format("Chỉ cho phép mua tối đa %sđ", CurrencyFormat.format(subTotalAllowMaximum)));
        }
        log.info("[CART]SUB TOTAL OF ORDER: " + subTotal);
        log.info("[CART]SUBTOTAL ALLOW FREE SHIP: " + subTotalAllowFreeShip);
        log.info("[CART]ALLOW FREE SHIP: " + (subTotal > subTotalAllowFreeShip));
        try {
            if (cart.getDistrictId() != null && cart.getProvinceId() != null && cart.getType() == Type.ONLINE && subTotal < subTotalAllowFreeShip) {
                JsonNode feeObject = calculateFee(cart.getId());
                if (feeObject != null) {
                    String feeString = String.valueOf(feeObject.get("data").get("total"));
                    Double feeDouble = DataUtils.safeToDouble(feeString);
                    System.out.println("FEEE: " + feeDouble);
                    cart.setDeliveryFee(feeDouble);
                    cart.setTotal(fetchTotal(cart) + feeDouble - cart.getDiscount());
                }
            } else {
                cart.setDeliveryFee(0.0);
                cart.setTotal(fetchTotal(cart) - cart.getDiscount());
            }
        } catch (Exception e) {
            log.error("Hệ thống tính phí gặp trục trặc");
            cart.setDeliveryFee(cart.getDeliveryFee());
        }
        cartRepository.save(cart);
    }

    private double getFinalPrice(ProductDetail productDetail) {
        double originPrice = productDetail.getPrice();
        double finalPrice = productDetail.getPrice();
        List<Event> validEvents = productDetail.getProduct().getValidEvents();
        if (!validEvents.isEmpty()) {
            double averageDiscount = validEvents.stream()
                    .mapToInt(Event::getDiscountPercent)
                    .average()
                    .orElse(0.0);
            finalPrice = finalPrice / 100 * (100 - averageDiscount);
        }
        System.out.println("ORIGIN PRICE: " + originPrice);
        System.out.println("FINAL PRICE: " + finalPrice);
        return finalPrice;
    }

    public Double fetchTotal(Cart cart) {
        return Optional.ofNullable(cart.getCartDetails())
                .orElse(Collections.emptyList())
                .stream()
                .mapToDouble(s -> {
                    getFinalPrice(s.getProductDetail());
                    return getFinalPrice(s.getProductDetail()) * s.getQuantity();
                })
                .sum();
    }


    @Transactional
    public Cart unlinkVoucher(Integer idCart) {
        Cart cart = cartRepository.findById(idCart).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng"));
        cart.setVoucher(null);
        cart.setDiscount(0.0);
        reloadSubTotalOrder(cart);
        return cartRepository.save(cart);
    }

    public JsonNode calculateFee(Integer idCart) {
        Cart cart = cartRepository.findById(idCart).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng"));
        FeeDTO feeDTO = new FeeDTO();
        feeDTO.setService_type_id(2);
        feeDTO.setFrom_district_id(3440); // quận Nam Từ Liêm

        Integer totalHeight = cart.getCartDetails().stream()
                .map(s -> s.getProductDetail().getMass() * s.getQuantity()) // Tính toán khối lượng nhân với số lượng
                .reduce(0, Integer::sum); // Tính tổng (giá trị ban đầu là 0)

        if (cart.getDistrictId() != null && cart.getProvinceId() != null) {
            System.out.println("DISTRICT: " + cart.getDistrictId());
            System.out.println("PROVINCE: " + cart.getProvinceId());
            System.out.println("WARD: " + cart.getWardId());
            feeDTO.setTo_district_id(cart.getDistrictId());
            feeDTO.setTo_ward_code(cart.getWardId());

            feeDTO.setHeight(2);
            feeDTO.setLength(2);
            feeDTO.setWeight(totalHeight);
            feeDTO.setWidth(2);

            feeDTO.setInsurance_value(0);

            feeDTO.setCoupon("");
            List<ItemDTO> dtoList = cart.getCartDetails().stream().map(s -> {
                ItemDTO itemDTO = new ItemDTO();
                itemDTO.setName("ORDER");
                itemDTO.setQuantity(s.getQuantity());
                itemDTO.setHeight(200);
                itemDTO.setWeight(200);
                itemDTO.setLength(200);
                itemDTO.setWidth(200);
                return itemDTO;
            }).toList();
            feeDTO.setItems(dtoList);
            try {
                JsonNode fee = feeService.calculator(
                        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                        feeDTO
                );
                String a = String.valueOf(fee.get("data").get("total"));
                System.out.println(a);
                return fee;
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển");
            }
        } else {
            return null;
        }
    }

    public boolean check_valid_product_detail_quantity_in_storage_for_online_order(Cart cart) {
        boolean available = true;
        List<CartDetail> cartDetails = cart.getCartDetails();
        for (CartDetail cartDetail : cartDetails) {
            ProductDetail productDetail = cartDetail.getProductDetail();
            int order_detail_quantity = cartDetail.getQuantity();
            int product_detail_quantity = productDetail.getQuantity();
            if (order_detail_quantity > product_detail_quantity) {
                available = false;
            }
        }
        return available;
    }



    public boolean check_valid_voucher_quantity_in_storage(Cart cart) {
        Voucher voucher = cart.getVoucher();
        if (voucher == null) {
            return true;
        } else {
            return voucher.getQuantity() > 0;
        }
    }
}
