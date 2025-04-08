package org.example.demo.controller.cart;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.math3.analysis.function.Add;
import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.request.CartRequestDTOV2;
import org.example.demo.dto.cart.request.UseCartVoucherDTO;
import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.cart.response.CartResponseMapper;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.cart.CartService;
import org.example.demo.service.cart.CartServiceV2;
import org.example.demo.service.customer.AddressService;
import org.example.demo.service.customer.CustomerService;
import org.example.demo.service.fee.FeeService;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.auth.AuthUtil;
import org.example.demo.validate.group.GroupUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@Slf4j
@RestController
@RequestMapping(value = "cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private FeeService feeService;

    @Autowired
    private RandomCodeGenerator randomCodeGenerator;

    @Autowired
    private CartServiceV2 cartServiceV2;

    @Autowired
    private CartResponseMapper cartResponseMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/{idCustomer}")
    public List<CartResponseDTO> getListCart(@PathVariable Integer idCustomer) {
        return cartService.getListCart(idCustomer);
    }


    @PostMapping("/add-to-cart")
    public ResponseEntity<?> addCart(@RequestBody CartRequestDTO cartRequestDTO) {
        return cartService.create(cartRequestDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable Integer id) {
        return cartService.deleteById(id);
    }

    @PutMapping
    public ResponseEntity<?> updateCart(@RequestBody CartRequestDTO cartRequestDTO) {
        return cartService.update(cartRequestDTO);
    }

    @DeleteMapping("/delete-all/{idCustomer}")
    public ResponseEntity<?> deleteAllCart(@PathVariable Integer idCustomer) {
        return cartService.deleteAll(idCustomer);
    }

    //  phah04
    @PutMapping(value = {"v2/{id}"})
    public ResponseEntity<CartResponseDTO> update(@PathVariable Integer id, @Validated(GroupUpdate.class) @RequestBody CartRequestDTOV2 cartRequestDTOV2) {
        return ResponseEntity.ok(cartResponseMapper.toDTO(cartServiceV2.update(id, cartRequestDTOV2)));

    }

    //  phah04
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(cartResponseMapper.toDTO(cartRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Giỏ hàng ko tồn tại"))));
    }

    private Address getDefaultAddress(Integer customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> customer.getAddresses().stream()
                        .filter(Address::getDefaultAddress) // Lọc địa chỉ mặc định
                        .findFirst()
                        .orElse(null))
                .orElse(null);
    }

    //  phah04
    @GetMapping("new-cart")
    public ResponseEntity<?> createNewCart() {
        Cart cart = new Cart();
        cart.setCode("CR" + randomCodeGenerator.generateRandomCode());
        cart.setStatus(Status.PENDING);
        cart.setDeleted(false);
        cart.setPayment(Payment.CASH);
        cart.setType(Type.ONLINE);
        cart.setSubTotal(0.0);
        cart.setTotal(0.);
        cart.setDiscount(0.);
        cart.setDeliveryFee(0.);

        Account account = AuthUtil.getAccount();
        if (account != null && account.getCustomer() != null) {
            log.info("CÓ TÀI KHOẢN KHÁCH HÀNG");
            Customer customerFound = account.getCustomer();
            Address defaultAddress = getDefaultAddress(customerFound.getId());
            if (defaultAddress != null) {
                log.info("CÓ ĐỊA CHỈ MẶC ĐỊNH");
                try {
                    cart.setAddress(defaultAddress.getDetail());
                    cart.setDistrictId(Integer.valueOf(defaultAddress.getDistrictId()));
                    cart.setProvinceId(Integer.valueOf(defaultAddress.getProvinceId()));
                    cart.setWardId(defaultAddress.getWardId());
                    cart.setProvinceName(defaultAddress.getProvince());
                    cart.setDistrictName(defaultAddress.getDistrict());
                    cart.setWardName(defaultAddress.getName());
                    cart.setRecipientName(defaultAddress.getName());
                    cart.setPhone(defaultAddress.getPhone());
                    cart.setEmail(customerFound.getEmail());
                } catch (Exception ex) {
                    log.error("SET DIA CHI MAC DINH CHO KHACH HANG XAY RA LOI");
                }
            } else {
                log.info("KHÔNG CÓ ĐỊA CHỈ MẶC ĐỊNH");
            }
        } else {
            log.info("KHÔNG CÓ TÀI KHOẢN KHÁCH HÀNG");
        }
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    //  phah04
    @GetMapping("check-cart-active/{id}")
    public ResponseEntity<?> checkCartActive(@PathVariable Integer id) {
        Cart cart = cartRepository.findByIdAndDeleted(id, false);
        Account account = AuthUtil.getAccount();
        if (account != null && cart != null) {
            Customer customer = account.getCustomer();
            if (customer != null) {
                cart.setCustomer(customer);
                log.info("CUSTOMER: " + customer.getEmail());
                Address defaultAddress = getDefaultAddress(customer.getId());
                if (defaultAddress != null) {
                    log.info("CÓ ĐỊA CHỈ MẶC ĐỊNH");
                    try {
                        cart.setAddress(defaultAddress.getDetail());
                        cart.setDistrictId(Integer.valueOf(defaultAddress.getDistrictId()));
                        cart.setProvinceId(Integer.valueOf(defaultAddress.getProvinceId()));
                        cart.setWardId(defaultAddress.getWardId());
                        cart.setProvinceName(defaultAddress.getProvince());
                        cart.setDistrictName(defaultAddress.getDistrict());
                        cart.setWardName(defaultAddress.getName());
                        cart.setRecipientName(defaultAddress.getName());
                        cart.setPhone(defaultAddress.getPhone());
                    } catch (Exception ex) {
                        log.error("SET DIA CHI MAC DINH CHO KHACH HANG XAY RA LOI");
                    }
                } else {
                    log.info("KHÔNG CÓ ĐỊA CHỈ MẶC ĐỊNH");
                }
            }
        }
        if (cart == null) {
            throw new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng");
        } else {
            return ResponseEntity.ok(cartResponseMapper.toDTO(cart));
        }
    }

    //  phah04
    @PostMapping(value = "use-voucher")
    public ResponseEntity<?> addVoucher(@Valid @RequestBody UseCartVoucherDTO request) {
        Cart cartFound = cartRepository.findById(request.getIdCartId()).orElseThrow(
                () -> new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng")
        );
        Voucher voucherFound = voucherRepository.findByCode(request.getVoucherCode()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Khuyễn mãi không tồn tại"));
        check_own_voucher(voucherFound);
        System.out.println(cartFound.getCode());
        System.out.println(voucherFound.getCode());
        Double total = cartServiceV2.fetchTotal(cartFound);
        Integer t = voucherFound.getMinAmount();
        // kiêm tra số lương
        if (voucherFound.getQuantity() > 0) {
            if (total >= t) {
                double discount = total / 100 * voucherFound.getMaxPercent();
                cartFound.setTotal(total - discount);
                cartFound.setDiscount(discount);
                cartFound.setSubTotal(total);
                cartFound.setVoucher(voucherFound);
            } else {
                throw new CustomExceptions.CustomBadRequest("Số tiền tối thiểu không đáp ứng");
            }
        } else {
            throw new CustomExceptions.CustomBadRequest("Voucher này đã được sử dụng hết số lượng");
        }
        cartFound = cartRepository.save(cartFound);
        cartServiceV2.reloadSubTotalOrder(cartFound);
        return ResponseEntity.ok(cartResponseMapper.toDTO(cartFound));
    }

    @GetMapping("/allow-checkout/{cartId}")
    public ResponseEntity<?> checkAllowCheckout(@PathVariable Integer cartId){
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        if(!cartServiceV2.check_valid_product_detail_quantity_in_storage_for_online_order(cart)){
            throw new CustomExceptions.CustomBadRequest("Có sản phẩm nào đó không đủ số lượng đáp ứng");
        } else if (cart.getCartDetails().isEmpty()) {
            throw new CustomExceptions.CustomBadRequest("Không thể thanh toán khi chưa có sản phẩm nào trong giỏ hàng");
        } else{
            return ResponseEntity.ok("ok bayby");
        }
    }

    @GetMapping("/unlink-voucher/{cartId}")
    public ResponseEntity<?> unlinkVoucher(@PathVariable Integer cartId) {
        return ResponseEntity.ok(cartResponseMapper.toDTO(cartServiceV2.unlinkVoucher(cartId)));
    }

    @GetMapping("/allow-convert/{cartId}")
    public ResponseEntity<?> checkAllowConvert(@PathVariable Integer cartId){
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        if(!cartServiceV2.check_valid_voucher_quantity_in_storage(cart)){
            throw new CustomExceptions.CustomBadRequest("Voucher không đáp ứng đủ số lượng");
        }
        if(!cartServiceV2.check_valid_product_detail_quantity_in_storage_for_online_order(cart)){
            throw new CustomExceptions.CustomBadRequest("Có sản phẩm nào đó không đủ số lượng đáp ứng");
        } else if (cart.getCartDetails().isEmpty()) {
            throw new CustomExceptions.CustomBadRequest("Không thể thanh toán khi chưa có sản phẩm nào trong giỏ hàng");
        } else{
            return ResponseEntity.ok("ok bayby");
        }
    }

    @GetMapping("/edit-my-address/{cartId}")
    public ResponseEntity<?> updateMyAddress(@PathVariable Integer cartId, @RequestParam(value = "addressId") Integer addressId) {
        log.info("CART ID"+ cartId);
        log.info("ADDRESS ID"+ addressId);
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        List<Address> list = new ArrayList<>();
        Account account = AuthUtil.getAccount();
        if (account != null) {
            Customer customer = account.getCustomer();
            if (customer != null) {
                list = addressService.getMyAddress();
                Optional<Address> addressFound = list.stream().filter(s -> Objects.equals(s.getId(), addressId)).findFirst();
                if (addressFound.isPresent()) {
                    Address selectedAddress = addressFound.get();
                    cart.setAddress(selectedAddress.getDetail());
                    cart.setDistrictName(selectedAddress.getDistrict());
                    cart.setDistrictId(Integer.valueOf(selectedAddress.getDistrictId()));
                    cart.setProvinceName(selectedAddress.getProvince());
                    cart.setProvinceId(Integer.valueOf(selectedAddress.getProvinceId()));
                    cart.setWardName(selectedAddress.getWard());
                    cart.setWardId(selectedAddress.getWardId());
                    cart.setRecipientName(selectedAddress.getName());
                    cart.setPhone(selectedAddress.getPhone());
                    cart.setEmail(customer.getEmail());
                    cartRepository.save(cart);
                }
            }
        }
        return ResponseEntity.ok("Ok");
    }

    private void check_own_voucher(Voucher voucher){
        Account account = AuthUtil.getAccount();
        if(account != null){
            if(account.getCustomer() != null){
                List<Integer> idCustomerList = voucher.getCustomers().stream().map(s -> s.getId()).toList();
                Integer customerId = account.getCustomer().getId();
                if(voucher.getTypeTicket() == org.example.demo.entity.voucher.enums.Type.Individual && !idCustomerList.contains(customerId)) {
                    throw new CustomExceptions.CustomBadRequest("Voucher này không thuộc quyền sử dụng của bạn");
                }
                else{
                    log.info("VOUCHER CHO PHÉP SỬ DỤNG");
                }
            }
        }
        else{
            throw new CustomExceptions.CustomBadRequest("Cần đăng nhập để có thể sử dụng voucher");
        }
    }
}



























