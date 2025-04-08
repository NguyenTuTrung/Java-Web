package org.example.demo.service.order;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.ghn.FeeDTO;
import org.example.demo.dto.ghn.ItemDTO;
import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.dto.order.core.request.CustomFeeOrderRequest;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.other.RefundAndChangeStatusDTO;
import org.example.demo.dto.order.other.UseOrderVoucherDTOByCode;
import org.example.demo.dto.order.other.UseOrderVoucherDTOById;
import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Payment;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.order.core.request.OrderRequestMapper;
import org.example.demo.mapper.order.core.response.OrderResponseMapper;
import org.example.demo.model.response.ICountOrderDetailInOrder;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.IService;
import org.example.demo.service.email.MailSenderService;
import org.example.demo.service.fee.FeeService;
import org.example.demo.service.history.HistoryService;
import org.example.demo.util.CurrencyFormat;
import org.example.demo.util.DataUtils;
import org.example.demo.util.RandomCodeGenerator;
import org.example.demo.util.auth.AuthUtil;
import org.example.demo.util.event.EventUtil;
import org.example.demo.util.number.NumberUtil;
import org.example.demo.util.order_detail_util.OrderDetailUtil;
import org.example.demo.util.phah04.PageableObject;
import org.example.demo.util.voucher.VoucherUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.ConnectException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Slf4j
@Service
public class OrderService implements IService<Order, Integer, OrderRequestDTO> {

    private final ExecutorService executorService = Executors.newFixedThreadPool(5);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private HistoryService historyService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private OrderResponseMapper orderResponseMapper;

    @Autowired
    private OrderRequestMapper orderRequestMapper;

    @Autowired
    private RandomCodeGenerator randomCodeGenerator;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private MailSenderService mailSenderService;

    @Autowired
    private FeeService feeService;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private VoucherUtil voucherUtil;

    @Value("${custom.subtotal.allow.free.ship}")
    private Double subTotalAllowFreeShip;

    @Value("${custom.subtotal.allow.maximum}")
    private Double subTotalAllowMaximum;

    public Page<OrderOverviewResponseDTO> findAllOverviewByPage(
            String status,
            String type,
            Boolean inStore,
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdDate")
            );
        }

        return orderRepository.findAllByPageWithQuery(query, status, type, inStore, createdFrom, createdTo, pageable).map(s -> orderResponseMapper.toOverViewDTO(s));
    }


    public Page<OrderOverviewResponseDTO> findAllMyOverviewByPage(
            String status,
            String type,
            Boolean inStore,
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdDate")
            );
        }

        Account account = AuthUtil.getAccount();
        Customer customer = new Customer();
        if (account != null && account.getCustomer() != null) {
            customer = account.getCustomer();
        }

        return orderRepository.findAllByPageWithQueryOfMe(query, status, type, inStore, createdFrom, createdTo, customer, pageable).map(s -> orderResponseMapper.toOverViewDTO(s));
    }

    public CountStatusOrder getMyCountStatusAnyOrder(String type) {
        Account account = AuthUtil.getAccount();
        Customer customer = new Customer();
        if (account != null && account.getCustomer() != null) {
            customer = account.getCustomer();
        }
        return orderRepository.getMyCountStatus(type, customer);
    }

    @Override
    public Order findById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found"));
    }

    public Order findByCode(String code) {
        return orderRepository.findByCode(code).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found"));
    }

    @Override
    @Transactional
    public Order delete(Integer id) {
        Order entityFound = findById(id);
        entityFound.setDeleted(true);
        return entityFound;
    }

    @Transactional
    public Order refund_and_change_status(RefundAndChangeStatusDTO refundAndChangeStatusDTO, int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
//        List<History> histories = order.getHistories();
//        if(!histories.isEmpty()){
//            History lastHistory = histories.get(histories.size() - 1);
//            if (lastHistory.getStatus() == Status.PENDING){
//                throw new CustomExceptions.CustomBadRequest("Hóa đơn đang ở trạng thái không cho phép hủy và hoàn trả)");
//            }
//        }
        Status oldStatus = order.getStatus();
        Status newStatus = refundAndChangeStatusDTO.getStatus();
        Double amount = refundAndChangeStatusDTO.getAmount();
        String tradingCode = refundAndChangeStatusDTO.getTradingCode();
        History history = new History();
        String note = String.format("Trả lại: %sđ - Mã giao dịch: %s", NumberUtil.formatCurrency(amount), tradingCode);
        history.setNote(note);
        history.setAccount(AuthUtil.getAccount());
        history.setOrder(order);
        history.setStatus(refundAndChangeStatusDTO.getStatus());
        historyRepository.save(history);
        order.setStatus(newStatus);
        if (oldStatus == Status.PENDING && newStatus == Status.CANCELED && order.getInStore()) {
            rollback_quantity_order(order);
        }
        if (oldStatus == Status.PENDING && newStatus == Status.TOSHIP && !order.getInStore()) {
            minusProductDetailsQuantity(order);
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order save(OrderRequestDTO requestDTO) {
        History orderHistory = new History();
        Order entityMapped = orderRequestMapper.toEntity(requestDTO);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
            && !(authentication instanceof AnonymousAuthenticationToken)) {
            Account account = (Account) authentication.getPrincipal();
            if (account.getStaff() != null) {
                log.info("STAFF CODE: " + account.getStaff().getCode());
            }
            entityMapped.setStaff(account.getStaff());
        }

        entityMapped.setDeleted(false);
        entityMapped.setStatus(Status.PENDING);
        entityMapped.setPayment(Payment.CASH);
        entityMapped.setCode("HDI" + randomCodeGenerator.generateRandomCode());

        entityMapped.setSubTotal(0.0);
        entityMapped.setTotal(0.0);
        entityMapped.setDiscount(0.0);
        entityMapped.setDeliveryFee(0.0);
        entityMapped.setTotalPaid(0.0);
        entityMapped.setDiscountVoucherPercent(0.0);
        entityMapped.setIsPayment(false);
        entityMapped.setVoucherMinimumSubtotalRequired(0.0);
        entityMapped.setInStore(true);

        orderHistory.setNote("Khởi tạo đơn hàng tại quầy");
        orderHistory.setStatus(Status.PENDING);
        orderHistory.setOrder(entityMapped);
        orderHistory.setAccount(AuthUtil.getAccount());

        entityMapped.getHistories().add(orderHistory);

        Customer customerSelected = requestDTO.getCustomer();
        Voucher voucherSelected = requestDTO.getVoucher();

        if (customerSelected != null && customerSelected.getId() != null) {
            Integer id = customerSelected.getId();
            customerSelected = customerRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Customer provided not found"));
            entityMapped.setCustomer(customerSelected);
        }
        if (voucherSelected != null && voucherSelected.getId() != null) {
            Integer id = voucherSelected.getId();
            voucherSelected = voucherRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Voucher provided not found"));
            entityMapped.setVoucher(voucherSelected);
        }
        reloadSubTotalOrder(entityMapped);
        return orderRepository.save(entityMapped);
    }

    private Address getDefaultAddress(Integer customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> customer.getAddresses().stream()
                        .filter(Address::getDefaultAddress) // Lọc địa chỉ mặc định
                        .findFirst()
                        .orElse(null))
                .orElse(null);
    }

    @Transactional
    public Order updateCustomerAndSetDefaultAddress(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));

        History history = new History();
        history.setOrder(order);
        history.setAccount(AuthUtil.getAccount());


        if (requestDTO.getCustomer() != null) {
            if (requestDTO.getCustomer().getId() != null) {
                Customer selectedCustomer = customerRepository.findById(requestDTO.getCustomer().getId()).orElse(null);
                if (selectedCustomer != null) {
                    order.setEmail(selectedCustomer.getEmail());
                    order.setPhone(selectedCustomer.getPhone());
                    log.info("THÔNG TIN KHÁCH HÀNG TỒN TẠI");
                    order.setCustomer(selectedCustomer);
                    history.setNote(String.format("Gán thông tin K/H %s cho đơn hàng", selectedCustomer.getCode()));

                    Address defaultAddress = getDefaultAddress(selectedCustomer.getId());
                    if (order.getType() == Type.ONLINE) {
                        log.info("LÀ ĐƠN GIAO HÀNG");
                        if (defaultAddress != null) {
                            log.info("ĐỊA CHỈ MẶC ĐỊNH KHÁCH HÀNG TỒN TẠI");
                            log.info("TINH: {}, HUYEN: {}, XA: {}, CHI TIET: {}", defaultAddress.getProvince(), defaultAddress.getDistrict(), defaultAddress.getWard(), defaultAddress.getDetail());
                            order.setProvinceId(Integer.valueOf(defaultAddress.getProvinceId()));
                            order.setDistrictId(Integer.valueOf(defaultAddress.getDistrictId()));
                            order.setWardId(defaultAddress.getWardId());

                            order.setProvinceName(defaultAddress.getProvince());
                            order.setDistrictName(defaultAddress.getDistrict());
                            order.setWardName(defaultAddress.getWard());
                            order.setAddress(defaultAddress.getDetail());
                            order.setRecipientName(defaultAddress.getName());
                            order.setPhone(defaultAddress.getPhone());
                        } else {
                            log.info("ĐỊA CHỈ MẶC ĐỊNH KHÁCH HÀNG KHÔNG TỒN TẠI");
                        }
                    } else {
                        log.info("KHÔNG LÀ ĐƠN GIAO HÀNG");
                    }
                } else {
                    log.info("THÔNG TIN KHÁCH HÀNG KHÔNG TỒN TẠI");
                }
            }
        }
        history.setStatus(order.getStatus());
        historyRepository.save(history);
        reloadSubTotalOrder(order);

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order update(Integer id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Order not found with id: " + id));
        History history = new History();
        history.setOrder(order);

        String oldAddress = DataUtils.safeToString(order.getAddress()).trim() + ", " + DataUtils.safeToString(order.getWardName()).trim() + ", " + DataUtils.safeToString(order.getDistrictName()).trim() + ", " + DataUtils.safeToString(order.getProvinceName()).trim();

        String address = "";
        // update customer
        if (requestDTO.getCustomer() != null) {
            if (requestDTO.getCustomer().getId() != null) {
                Customer selectedCustomer = customerRepository.findById(requestDTO.getCustomer().getId()).orElse(null);
                if (selectedCustomer != null) {
                    order.setCustomer(selectedCustomer);
                }
            }
            history.setNote("Thêm thông tin khách hàng");
        }
        // update voucher
        if (requestDTO.getVoucher() != null) {
            if (requestDTO.getVoucher().getId() != null) {
                Voucher selectedVoucher = voucherRepository.findById(requestDTO.getVoucher().getId()).orElse(null);
                if (selectedVoucher != null) {
                    order.setVoucher(selectedVoucher);
                }
            }
            history.setNote("Thêm thông tin khuyến mãi");
        }
        // payment
        if (requestDTO.getPayment() != null) {
            order.setPayment(requestDTO.getPayment());
        }
        // type
        if (requestDTO.getType() != null) {
            order.setType(requestDTO.getType());
        }
        // type
        if (requestDTO.getStatus() != null) {
            order.setStatus(requestDTO.getStatus());
        }
        // address
        if (requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())) {
            if (order.getStatus() != Status.PENDING) {
                throw new CustomExceptions.CustomBadRequest("Không thể thay đổi địa chỉ khi đơn hàng không ở trạng thái chờ xác nhận");
            }
            String detail = requestDTO.getAddress();
            address += detail;
        }
        // ward
        if (requestDTO.getWardId() != null && !DataUtils.isNullOrEmpty(requestDTO.getWardName())) {
            address += ", " + requestDTO.getWardName();
            order.setWardName(requestDTO.getWardName());
            order.setWardId(requestDTO.getWardId());
        }
        // district
        if (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) {
            address += ", " + requestDTO.getDistrictName();
            order.setDistrictName(requestDTO.getDistrictName());
            order.setDistrictId(requestDTO.getDistrictId());
        }
        // province
        if (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) {
            address += ", " + requestDTO.getProvinceName();
            order.setProvinceName(requestDTO.getProvinceName());
            order.setProvinceId(requestDTO.getProvinceId());
        }
        // set address
        if (!DataUtils.isNullOrEmpty(address)) {
            order.setAddress(requestDTO.getAddress());
        }
        // phone
        if (requestDTO.getPhone() != null && !DataUtils.isNullOrEmpty(requestDTO.getPhone())) {
            order.setPhone(requestDTO.getPhone());
        }
        // recipientName;
        if (requestDTO.getRecipientName() != null && !DataUtils.isNullOrEmpty(requestDTO.getRecipientName())) {
            order.setRecipientName(requestDTO.getRecipientName());
        }
        // return order
        reloadSubTotalOrder(order);

        String finalAddress = DataUtils.safeToString(order.getAddress()).trim() + ", " + DataUtils.safeToString(order.getWardName()).trim() + ", " + DataUtils.safeToString(order.getDistrictName()).trim() + ", " + DataUtils.safeToString(order.getProvinceName()).trim();
        if (((requestDTO.getAddress() != null && !DataUtils.isNullOrEmpty(requestDTO.getAddress())) || (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName())) || (requestDTO.getDistrictId() != null && !DataUtils.isNullOrEmpty(requestDTO.getDistrictName())) || (requestDTO.getProvinceId() != null && !DataUtils.isNullOrEmpty(requestDTO.getProvinceName()))) && !oldAddress.equalsIgnoreCase(finalAddress)) {
            historyService.createNewHistoryObject(order, order.getStatus(), String.format("Thay đổi địa chỉ từ %s -> %s", oldAddress, finalAddress));
        }
        return orderRepository.save(order);
    }

    private void checkValidateQuantity(Order order) {
        // B1: CHECK ĐỦ SỐ LƯỢNG PRODUCT DETAIL CÓ THỂ CUNG CẤP (CHỈ CẦN CHECK KHI CHUYỂN TỪ PENDING SANG TOSHIP)
        if (!order.getInStore()) {
            boolean availableProductDetailQuantity = check_valid_product_detail_quantity_in_storage_for_online_order(order);
            log.info("VALIDATE PRODUCT DETAIL QUANTITY: " + availableProductDetailQuantity);
            if (!availableProductDetailQuantity) {
                throw new CustomExceptions.CustomBadRequest("Có sản phẩm nào đó không đủ cung ứng");
            }
        }
        // B2: CHECK ĐỦ SỐ LƯỢNG VOUCHER CÓ THỂ CUNG CẤP (CHỈ CẦN CHECK KHI CHUYỂN TỪ PENDING SANG TOSHIP)
        boolean availableVoucherQuantity = check_valid_voucher_quantity_in_storage(order);
        log.info("VALIDATE VOCUHER USED: " + availableVoucherQuantity);
        if (!availableVoucherQuantity) {
            throw new CustomExceptions.CustomBadRequest("Khuyến mãi này không đủ cung ứng");
        }
    }

    @Transactional
    public Order changeStatus(Integer id, HistoryRequestDTO requestDTO) {
        Order entityFound = findById(id);

        if (requestDTO.getStatus() == Status.CANCELED && entityFound.getIsPayment() && entityFound.getPayment() == Payment.TRANSFER) {
            if (DataUtils.isNullOrEmpty(requestDTO.getNote())) {
                throw new CustomExceptions.CustomBadRequest("Vui lòng nhập nội dung và mã giao dịch trước khi hủy");
            }
        }

        // B1: CHECK TRU SO LUONG(TRƯỢC KHI CẬP NHẬT TRẠNG THÁI MỚI)
        Status oldStatus = entityFound.getStatus();
        Status newStatus = requestDTO.getStatus();

        log.info("OLD STATUS: " + oldStatus);
        log.info("NEW STATUS: " + newStatus);
        log.info("-----------------1");
        if (oldStatus == Status.CANCELED && newStatus == Status.TOSHIP) {
            throw new CustomExceptions.CustomBadRequest("Không thể chuyển sang chờ vận chuyển do đơn hàng đã bị hủy trước đó");
        }
        if (oldStatus == Status.CANCELED && newStatus == Status.CANCELED) {
            throw new CustomExceptions.CustomBadRequest("Đơn hàng đã bị hủy trước đó");
        }
        if (oldStatus == Status.TOSHIP && newStatus == Status.CANCELED) {
            throw new CustomExceptions.CustomBadRequest("Không thể hủy khi đơn hàng đang ở trạng thái xác nhận");
        }
        if (oldStatus == Status.CANCELED && newStatus == Status.PENDING) {
            throw new CustomExceptions.CustomBadRequest("Đon hàng đã bị hủy trước đó");
        }
        boolean isRequiredCancelOnlinePayment = isRequiredCancelOnlinePaymentOrder(entityFound);
        if (isRequiredCancelOnlinePayment && newStatus == Status.TOSHIP && entityFound.getType() == Type.ONLINE) {
            throw new CustomExceptions.CustomBadRequest("Đơn hàng đang có yêu cầu hủy và hoàn trả");
        }
        // HÓA ĐƠN CHỜ -> CHỜ VẬN CHUYỂN
        if (oldStatus == Status.PENDING && newStatus == Status.TOSHIP) {
            log.info("1. TRUONG HOP 1");
            // khi nảo check ? (1. đơn tại quầy là giao hàng , 2. là đơn online lúc convert) => chỉ cần check cho đơn tại quầy
            if (entityFound.getInStore()) {
                checkValidateQuantity(entityFound);
            }
            // nếu là đơn giao hàng
            if (entityFound.getType() == Type.ONLINE) {
                log.info("1.2 LÀ ĐƠN GIAO HÀNG");
                check_validate_address_for_online_order(entityFound);
                // kiem tra xem là đơn tại quầy hay đơn khách đặt online mà nhân viên đổi trạng thái
                // nếu là đơn khách đặt mua online thì trừ (bên offline đã trừ từ lúc thêm)
                if (!entityFound.getInStore()) {
                    log.info("2.1 LÀ ĐƠN ĐẶT ONLINE");
                    minusProductDetailsQuantity(entityFound);
                }
                // chuyển trạng thái thang toán(vì khách đã thanh toán hết tại quầy)
                if (entityFound.getInStore() && !entityFound.getIsPayment()) {
                    entityFound.setIsPayment(true);
                    entityFound.setTotalPaid(entityFound.getTotal());
                }
            }
//            if (!entityFound.getInStore()) {
//                if (entityFound.getVoucher() != null) {
//                    decreaseQuantityVoucher(entityFound.getVoucher());
//                }
//            }

            log.info("1");
        }

        // CHỜ VẬN CHUYỂN -> CHỜ XÁC NHẬN
        else if (oldStatus == Status.TOSHIP && newStatus == Status.PENDING) {
            log.info("2");
            // CHỈ ROLLBACK CHO ĐƠN ONLINE (ĐƠN OFFLINE CHỈ ROLLBACK KHI HỦY)
            if (!entityFound.getInStore()) {
                rollback_quantity_order(entityFound);
            }
            // ROLLBACK VOUCHER CHO DON INSTORE
            if (entityFound.getVoucher() != null && entityFound.getInStore()) {
                increaseQuantityVoucher(entityFound.getVoucher());
            }
        }
        // CHỜ XÁC NHẬN -> ĐÃ GIAO HÀNG
        else if (oldStatus == Status.PENDING && newStatus == Status.DELIVERED) {
            if (entityFound.getType() == Type.ONLINE) {
                check_validate_address_for_online_order(entityFound);
            }
            checkValidateQuantity(entityFound);

            //
            log.info("3");
            entityFound.setIsPayment(true);
        }
        // ĐANG VẬN CHUYỂN -> ĐÃ GIAO HÀNG
        else if (oldStatus == Status.TORECEIVE && newStatus == Status.DELIVERED) {
            log.info("4");
            entityFound.setIsPayment(true);
        }
        // CHỜ VẬN CHUYỂN -> CHỜ XÁC NHẬN
        else if (oldStatus == Status.TORECEIVE && newStatus == Status.PENDING) {
            log.info("5");
            // CHỈ ROLLBACK CHO ĐƠN ONLINE (ĐƠN OFFLINE CHỈ ROLLBACK KHI HỦY)
            if (!entityFound.getInStore()) {
                rollback_quantity_order(entityFound);
            }
            // ROLLBACK VOUCHER
            if (entityFound.getVoucher() != null) {
                increaseQuantityVoucher(entityFound.getVoucher());
            }
        }
        // CHỜ XÁC NHẬN -> HỦY (ĐƠN TẠI QUẦY) --> ROLLBACK LẠI SỐ LƯỢNG SP VÀ VOUCHER
        else if (oldStatus == Status.PENDING && newStatus == Status.CANCELED && entityFound.getInStore()) {
            rollback_quantity_order(entityFound);
        }
        // CHỜ XÁC NHẬN -> HỦY (ĐƠN TRỤC TUYẾN) --> ROLLBACK LẠI SỐ LƯỢNG VOUCHER
        else if (oldStatus == Status.PENDING && newStatus == Status.CANCELED && entityFound.getInStore() == false) {
            if (entityFound.getVoucher() != null) {
                increaseQuantityVoucher(entityFound.getVoucher());
            }
        }


        if (oldStatus != newStatus) {
            sendEmail(entityFound, requestDTO.getNote());
        }
        log.info("-----------------2");

        //B2: CẬP NHẬT TRẠNG THÁI MỚI
        entityFound.setStatus(requestDTO.getStatus());
        //B3: LƯU LỊCH SỬ
        History history = new History();
        history.setOrder(entityFound);
        history.setNote(requestDTO.getNote());
        history.setStatus(requestDTO.getStatus());
        history.setAccount(AuthUtil.getAccount());
        historyRepository.save(history);


        reloadSubTotalOrder(entityFound);
        if (entityFound.getInStore()) {
            if (oldStatus == Status.PENDING && (newStatus == Status.DELIVERED || newStatus == Status.TOSHIP)) {
                // trừ số lượng voucher
                if (entityFound.getVoucher() != null) {
                    decreaseQuantityVoucher(entityFound.getVoucher());
                }
            }
        }
        return orderRepository.save(entityFound);
    }

    private boolean check_validate_address_for_online_order(Order order) {
        if (order.getRecipientName() == null || order.getPhone() == null || order.getProvinceId() == null || order.getDistrictId() == null || order.getWardId() == null) {
            throw new CustomExceptions.CustomBadRequest("Vui lòng cung cấp tên, số điện thoại và địa chỉ cho đơn hàng này");
        }
        return true;
    }

    @Transactional
    public Order addVoucherById(UseOrderVoucherDTOById request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findById(request.getIdVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Phiếu giảm giá không hợp lệ"));
        useVoucher(voucherFound, orderFound);
        return orderRepository.save(orderFound);
    }

    @Transactional
    public Order addVoucherCode(UseOrderVoucherDTOByCode request) {
        Order orderFound = findById(request.getIdOrder());
        Voucher voucherFound = voucherRepository.findByCode(request.getCodeVoucher()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Phiếu giảm giá không hợp lệ"));
        useVoucher(voucherFound, orderFound);
        return orderRepository.save(orderFound);
    }

    @Transactional
    public void useVoucher(Voucher newVoucherFound, Order orderFound) {
        System.out.println(orderFound.getCode());
        System.out.println(newVoucherFound.getCode());
        check_own_voucher(newVoucherFound);

        Voucher oldVoucher = orderFound.getVoucher();

        double subtotal_of_order = get_subtotal_of_order(orderFound);
        Integer t = newVoucherFound.getMinAmount();
        // kiêm tra số lương
        if (newVoucherFound.getQuantity() > 0) {
            if (subtotal_of_order >= t) {
                double discount = NumberUtil.roundDouble(subtotal_of_order / 100 * newVoucherFound.getMaxPercent());
                log.info("DISCOUNT VALUE: " + discount);
                log.info("DISCOUNT PERCENT: " + newVoucherFound.getMaxPercent());
                orderFound.setTotal(subtotal_of_order - discount);
                orderFound.setDiscount(discount);
                orderFound.setSubTotal(subtotal_of_order);
                orderFound.setDiscountVoucherPercent(Double.valueOf(newVoucherFound.getMaxPercent()));
                orderFound.setVoucher(newVoucherFound);
                // TRU SL VOUCHER
                if (oldVoucher != null && !Objects.equals(oldVoucher.getId(), newVoucherFound.getId())) {
                    if (!orderFound.getInStore()) {
                        decreaseQuantityVoucher(newVoucherFound);
                        increaseQuantityVoucher(oldVoucher);
                    }
                }


            } else {
                throw new CustomExceptions.CustomBadRequest("Số tiền tối thiểu không đáp ứng");
            }
        } else {
            throw new CustomExceptions.CustomBadRequest("Voucher này đã được sử dụng hết số lượng");
        }
        reloadSubTotalOrder(orderFound);
    }

    public CountStatusOrder getCountStatusAnyOrder(String type, LocalDateTime createdFrom, LocalDateTime createdTo) {
        return orderRepository.getCountStatus(type, createdFrom, createdTo);
    }

    public List<ICountOrderDetailInOrder> getCountOrderDetailInOrder(List<Integer> ids) {
        return orderRepository.getCountOrderDetailByIds(ids);
    }

    @Async
    public CompletableFuture<JsonNode> calculateFee(Integer idOrder) {
        Order order = findById(idOrder);
        FeeDTO feeDTO = new FeeDTO();
        feeDTO.setService_type_id(2);
        feeDTO.setFrom_district_id(3440); // quận Nam Từ Liêm

        if (order.getDistrictId() != null && order.getProvinceId() != null) {
            feeDTO.setTo_district_id(order.getDistrictId());
            feeDTO.setTo_ward_code(order.getWardId());

            feeDTO.setHeight(2);
            feeDTO.setLength(2);
            feeDTO.setWeight(2);
            feeDTO.setWidth(2);

            feeDTO.setInsurance_value(0);

            feeDTO.setCoupon("");
            List<ItemDTO> dtoList = order.getOrderDetails().stream().map(s -> {
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
                return CompletableFuture.completedFuture(fee);
            } catch (ConnectException ex) {
                throw new CustomExceptions.GHNException("NETWORK ERROR");
            } catch (Exception ex) {
                log.error(ex.getMessage());
                throw new CustomExceptions.CustomBadRequest("Lỗi tính phí vận chuyển. Vui lòng xem xét lại địa chỉ hợp lệ");
            }
        } else {
            return null;
        }
    }

    public List<StatisticOverviewResponse> fetchOrdersByStatusAndRangeTime(Status status, LocalDateTime from, LocalDateTime to) {
        return orderRepository.findAllByStatusAndCreatedDateBetweenOrderByCreatedDateDesc(status, from, to);
    }

    @Transactional
    public Order convertCartToOrder(Integer cartId) {
        boolean isPayment = false;
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không xác định được giỏ hàng"));
        // BẮT ĐẦU SET THÔNG TIN TỪ CART VÀO HÓA ĐƠN
        Order order = new Order();
        order.setCode("HDO" + randomCodeGenerator.generateRandomCode());
        order.setRecipientName(cart.getRecipientName());
        order.setAddress(cart.getAddress() + " " + cart.getDistrictName() + " " + cart.getDistrictName() + " " + cart.getProvinceName());
        order.setAddress(cart.getAddress());
        order.setProvinceId(cart.getProvinceId());
        order.setEmail(cart.getEmail());
        order.setProvinceName(cart.getProvinceName());
        order.setDistrictId(cart.getDistrictId());
        order.setDistrictName(cart.getDistrictName());
        order.setWardId(cart.getWardId());
        order.setWardName(cart.getWardName());
        order.setPhone(cart.getPhone());
        order.setDeleted(Boolean.FALSE);
        order.setTotal(NumberUtil.roundDouble(cart.getTotal()));
        order.setDeliveryFee(NumberUtil.roundDouble(cart.getDeliveryFee()));
        order.setDiscount(NumberUtil.roundDouble(cart.getDiscount()));
        order.setSubTotal(NumberUtil.roundDouble(cart.getSubTotal()));
        order.setType(Type.ONLINE);
        order.setStatus(Status.PENDING);
        order.setPayment(cart.getPayment());

        // SET CUSTOMER
        Account account = AuthUtil.getAccount();
        if (account != null && account.getCustomer() != null) {
            order.setCustomer(account.getCustomer());
        }
        // SET CUSTOMER

        order.setCustomer(cart.getCustomer());
        order.setVoucher(cart.getVoucher());

        order.setInStore(false);

        if (!order.getInStore()) {
            if (order.getVoucher() != null) {
                decreaseQuantityVoucher(order.getVoucher());
            }
        }

        if (cart.getVoucher() != null) {
            order.setDiscountVoucherPercent(Double.valueOf(cart.getVoucher().getMaxPercent()));
            order.setVoucherMinimumSubtotalRequired(Double.valueOf(cart.getVoucher().getMinAmount()));
        } else {
            order.setVoucherMinimumSubtotalRequired(0.0);
            order.setDiscountVoucherPercent(0.0);
        }

        order.setTotalPaid(0.0);
        order.setIsPayment(isPayment);
        //


        List<OrderDetail> list = new ArrayList<>();
        List<CartDetail> listCardDetail = cart.getCartDetails();
        Order orderSaved = orderRepository.save(order);

        historyService.createNewHistoryObject(orderSaved, Status.PENDING, "Khởi tạo đơn hàng");

        // HOÀN THÀNH LƯU HÓA ĐƠN MỚI
        listCardDetail.forEach(s -> {
            OrderDetail od = new OrderDetail();
            od.setOrder(order);
            od.setQuantity(s.getQuantity());
            od.setProductDetail(s.getProductDetail());
            od.setDeleted(false);
            od.setUnitPrice(OrderDetailUtil.get_current_product_detail_price(s.getProductDetail()));
            od.setAverageDiscountEventPercent(EventUtil.getAveragePercentEvent(s.getProductDetail().getProduct().getValidEvents()));
            list.add(od);
        });
        List<OrderDetail> orderDetailListSaved = orderDetailRepository.saveAll(list);
        order.setOrderDetails(orderDetailListSaved);

        Order result = orderRepository.save(order);
        reloadSubTotalOrder(order);
        cart.setDeleted(Boolean.TRUE);

        if (cart.getPayment() == Payment.CASH) {
            cart.setDeleted(Boolean.TRUE);
        }

        cartRepository.save(cart);
        if (cart.getPayment() == Payment.CASH) {
            sendEmail(result, "Khởi tạo đơn hàng");
        }
        return result;
    }


    public double get_total_value_of_order(Order order) {
        return get_discount_of_order_that_time(order) - get_discount_of_order_that_time(order);
    }

    @Transactional
    public void reloadSubTotalOrder(Order order) {

        // tổng tiền các sản phẩm(tính cả event)
        double subtotal = get_subtotal_of_order(order);
        log.info("SUBTOTAL: " + subtotal);
        order.setSubTotal(subtotal);

        // sau khi cập nhật subtotal thì cũng tự động chọn voucher phù hợp
        auto_fill_best_voucher_for_inStore_order(order);

        // tính tiền giảm của voucher cho hóa đơn
        double discount = get_discount_of_order_that_time(order);
        log.info("DISCOUNT: " + discount);
        order.setDiscount(discount);

        // tính ship
        double fee_ship = get_fee_ship_of_order(order);
        // tiền khách đã trả
        double total_paid = NumberUtil.roundDouble(order.getTotalPaid());
        // tổng tiền sau trừ giảm giá voucher và cộng ship
        double total_after_discount_and_fee = subtotal - discount + fee_ship;
        // tổng tiền cần thanh toán
        double total = NumberUtil.roundDouble(total_after_discount_and_fee - total_paid);

        log.info("FEE TOTAL: " + fee_ship);
        log.info("TOTAL: " + total);


        // ------------------ FIX FEE -----------------
        // hóa đơn có sản phẩm
        if (subtotal != 0) {
            order.setDeliveryFee(fee_ship);
        }
        // hóa đơn ko còn sản phẩm nào
        else {
            order.setDeliveryFee(0.0);
        }
        // ------------------ FIX FEE -----------------

        // NẾU ĐÃ NHẬN HÀNG (THANH TOÁN HÊT TIỀN)
        if (order.getStatus() == Status.DELIVERED) {
            order.setTotalPaid(total + total_paid);
            order.setTotal(0.0);
        }
        // NẾU CHƯA NHẬN
        else {
            // ĐƠN ONLINE
            if (order.getType() == Type.ONLINE) {
                // nếu có thanh toán r
                if (order.getIsPayment()) {
                    // NẾU TỔNG CẦN THANH TOÁN > 0 (TỨC CÓ ĐƠN PHÁT SINH)
                    if (total > 0) {
                        order.setTotal(total);
                    }
                    // NẾU KO CÓ ĐƠN PHÁT SINH
                    else {
                        order.setTotal(0.0);
                    }
                } else {
                    order.setTotal(total);
                }
            }
            // ĐƠN Ở CỦA HÀNG
            else if (order.getType() == Type.INSTORE) {
                order.setTotal(total);
            }
        }
        orderRepository.save(order);
    }

    // DISCOUNT CỦA HÓA ĐƠN
    // LẤY TỔNG TIỀN ĐƯỢC GIẢM GIÁ (ĐÃ CÓ VOUCHER)
    public double get_discount_of_order_that_time(Order order) {
        // phần trăm đc giảm giá đc lưu vào hóa đơn tại thời điểm tọa hóa đơn chờ
        double discount_percent_at_that_time = order.getDiscountVoucherPercent();
        // số tiền tối thiểu cần có để có thể áp dụng voucher
        double voucherMinimumSubtotalRequired = order.getVoucherMinimumSubtotalRequired();
        // lấy subtotal cần trả
        double subtotal_of_order = get_subtotal_of_order(order);
        // nếu đáp ứng giá trị đơn hàng tối thiểu với voucher
        log.info("SUBTOTAL ORDER: " + subtotal_of_order);
        log.info("VOUCHER SUBTOTAL REQUIRED: " + voucherMinimumSubtotalRequired);
        if (subtotal_of_order >= voucherMinimumSubtotalRequired) {
            log.info("CÓ THỂ SỬ DỤNG VOUCHER");
            return NumberUtil.roundDouble(subtotal_of_order / 100 * discount_percent_at_that_time);
        } else {
            log.info("KHÔNG THỂ SỬ DỤNG VOUCHER");
            order.setDiscountVoucherPercent(0.0);
            orderRepository.save(order);
            return 0.0;
        }
    }

    @Transactional
    public Order apply_custom_fee(CustomFeeOrderRequest customFeeOrderRequest) {
        Integer orderId = customFeeOrderRequest.getOrderId();
        Double amount = customFeeOrderRequest.getAmount();
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng"));
        boolean isValidAddress = check_validate_address_for_online_order(order);
        log.info("VALID ADDRESS: " + isValidAddress);
        double subTotal = get_subtotal_of_order(order);
        if (subTotal >= subTotalAllowFreeShip) {
            throw new CustomExceptions.CustomBadRequest("Đơn hàng đang được miễn phí ship");
        }
        order.setDeliveryFee(amount);
        Order orderSaved = orderRepository.save(order);
        reloadSubTotalOrder(orderSaved);
        return orderSaved;
    }

//    // SUBTOTAL CỦA HÓA DƠN
//    // LẤY TỔNG TIỀN THEO HÓA DƠN CHI TIẾT (ĐÃ ẤP DỤNG EVENT)
//    public double get_price_of_order_detail_at_that_time(OrderDetail s) {
//        ProductDetail productDetail = s.getProductDetail();
//        // lấy giá product detail cho tính toán
//        double productDetailPrice = productDetail.getPrice();
//        // lấy ra phần trăm giảm giá của sự kiện lúc tạo hóa đơn chờ tại thời điểm đó
//        double averageEventPercent = s.getAverageDiscountEventPercent();
//        // tính giá trị của hóa đơn chi tiết này tại thời điểm đó
//        return NumberUtil.roundDouble(productDetailPrice * (1 - averageEventPercent / 100));
//    }

    // SUBTOTAL CỦA HÓA DƠN CHI TIẾT
    // LẤY TỔNG TIỀN THEO HÓA ĐƠN (SUBTOTAL) (CHƯA CÓ VOCHER)
    public double get_subtotal_of_order(Order order) {
        double subtotal = 0;
        // lấy ra các hóa đơn không bị xóa của hóa đơn
        List<OrderDetail> orderDetailList = order.getOrderDetails().stream().filter((s) -> !s.getDeleted()).toList();
        // lặp tính tiền hóa đơn
        for (OrderDetail s : orderDetailList) {
            // lấy product detail cho việc tính toán
            double price_of_this_order_detail = s.getUnitPrice() * s.getQuantity();
            // cộng dồn giá trị vào total;
            subtotal += price_of_this_order_detail;
        }
        return NumberUtil.roundDouble(subtotal);
    }

    public double get_fee_ship_of_order(Order order) {
        double subTotal = get_subtotal_of_order(order);
        log.info("[ORDER]SUB TOTAL OF ORDER: " + subTotal);
        log.info("[ORDER]SUBTOTAL ALLOW FREE SHIP: " + subTotalAllowFreeShip);
        log.info("[ORDER]ALLOW FREE SHIP: " + (subTotal > subTotalAllowFreeShip));
        if (order.getIsFeeManually()) {
            return order.getDeliveryFee();
        } else {
            try {
                if (order.getDistrictId() != null && order.getProvinceId() != null && order.getType() == Type.ONLINE && subTotal < subTotalAllowFreeShip) {
                    CompletableFuture<JsonNode> feeFuture = calculateFee(order.getId());
                    // Chờ kết quả trong trường hợp cần (có thể dùng timeout)
                    JsonNode feeObject = feeFuture.join();
                    log.info("TÍNH PHÍ XONG");
                    if (feeObject != null) {
                        String feeString = String.valueOf(feeObject.get("data").get("total"));
                        return DataUtils.safeToDouble(feeString);
                    }
                }
                return 0;
            } catch (Exception e) {
                log.error("Hệ thống tính phí gặp trục trặc");
                return order.getDeliveryFee();
            }
        }
    }

    public Order callReCalculate(Integer id) {
        Order order = findById(id);
        reloadSubTotalOrder(order);
        return order;
    }

    @Transactional
    public void minusProductDetailsQuantity(Order order) {
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            ProductDetail productDetail = orderDetail.getProductDetail();
            int new_quantity = productDetail.getQuantity() - orderDetail.getQuantity();
            log.info("OLD QUANTITY: " + productDetail.getQuantity());
            log.info("NEW QUANTITY: " + new_quantity);
            productDetail.setQuantity(new_quantity);
            productDetailRepository.save(productDetail);
        }
    }

    public boolean check_valid_product_detail_quantity_in_storage_for_online_order(Order order) {
        boolean available = true;
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            ProductDetail productDetail = orderDetail.getProductDetail();
            int order_detail_quantity = orderDetail.getQuantity();
            int product_detail_quantity = productDetail.getQuantity();
            if (order_detail_quantity > product_detail_quantity) {
                available = false;
            }
        }
        return available;
    }

    public boolean check_valid_voucher_quantity_in_storage(Order order) {
        Voucher voucher = order.getVoucher();
        if (voucher == null) {
            return true;
        } else {
            return voucher.getQuantity() > 0;
        }
    }

    private void sendEmail(Order order, String note) {
        executorService.submit(() -> {
            try {
                if (order.getEmail() != null) {
                    log.info("ĐƠN HÀNG NÀY CÓ CUNG CẤP EMAIL");
                    mailSenderService.sendNewMail(order.getEmail(), "Kính chào quý khách", order, note);
                    log.info("ĐÃ GỬI EMAIL");
                } else {
                    log.info("ĐƠN HÀNG NÀY KHÔNG CUNG CẤP EMAIL");
                }
            } catch (Exception e) {
                log.error("Gửi mail thất bại", e);
            }
        });
    }

    @Transactional
    public void rollback_quantity_order(Order order) {
        List<OrderDetail> orderDetails = order.getOrderDetails().stream().filter(s -> !s.getDeleted()).toList();
        for (OrderDetail orderDetail : orderDetails) {
            int orderQuantity = orderDetail.getQuantity();
            ProductDetail productDetail = orderDetail.getProductDetail();
            productDetail.setQuantity(productDetail.getQuantity() + orderQuantity);
            productDetailRepository.save(productDetail);
        }
    }

    @Transactional
    public void decreaseQuantityVoucher(Voucher voucher) {
        int currentQuantity = voucher.getQuantity();
        if (currentQuantity > 0) {
            voucher.setQuantity(currentQuantity - 1);
            voucherRepository.save(voucher);
        }
    }

    @Transactional
    public void increaseQuantityVoucher(Voucher voucher) {
        int currentQuantity = voucher.getQuantity();
        voucher.setQuantity(currentQuantity + 1);
        voucherRepository.save(voucher);
    }

    @Transactional
    public void auto_fill_best_voucher_for_inStore_order(Order order) {
        if (order.getInStore() || AuthUtil.hasRole("ROLE_ADMIN") || AuthUtil.hasRole("ROLE_STAFF")) {
            Voucher oldVoucher = order.getVoucher();
            Voucher bestVoucher = voucherUtil.getBestVoucherCanUse(order);
            double subTotal = get_subtotal_of_order(order);
            order.setVoucher(bestVoucher);
            // NẾU KHÔNG CÓ VOUCHER PHÙ HỢP (KO CÓ VOUCHER NÀO DÙNG ĐƯỢC)

            // NẾU CÓ VOUCHER PHÙ HỢP
            if (bestVoucher != null) {
                log.info("BEST VOUCHER CODE: " + bestVoucher.getCode());
                order.setDiscountVoucherPercent(Double.valueOf(bestVoucher.getMaxPercent()));
                order.setVoucherMinimumSubtotalRequired(Double.valueOf(bestVoucher.getMinAmount()));

                // TU TRU SO LUONG NEU LÀ DƠN TRUC TUYEN
                if (!order.getInStore()) {
                    log.info("TRU LUON SO LUONG VOUCHER VỚI ĐƠN TRUC TUYEN");
                    decreaseQuantityVoucher(order.getVoucher());
                    log.info("- LUON SO LUONG VOUCHER: " + order.getVoucher().getCode());
                    if(oldVoucher != null){
                        increaseQuantityVoucher(oldVoucher);
                        log.info("+ LUON SO LUONG VOUCHER: " + oldVoucher.getCode());
                    }
                }
            } else if (oldVoucher != null) {
                // kiem tra dk voucher cu
                log.info("CÓ VOUCHER CŨ");
                if (subTotal >= oldVoucher.getMinAmount()) {
                    log.info("VOUCHER CŨ VẪN ĐỦ ĐIỀU KIỆN");
                    return;
                }
                log.info("VOUCHER CŨ KHÔNG ĐỦ ĐIỀU KIỆN");
            } else {
                log.info("BEST VOUCHER NULL");
                order.setDiscountVoucherPercent(0.0);
                order.setVoucherMinimumSubtotalRequired(0.0);
            }

//            // => ROLLBACK SO LUONG CU VOUCHER CŨ DA AP DUNG
//            if(oldVoucher != null){
//                increaseQuantityVoucher(oldVoucher);
//            }
//            if(bestVoucher != null){
//                decreaseQuantityVoucher(bestVoucher);
//            }
        }
    }

    @Transactional
    public Order unLinkCustomer(Integer id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        reloadSubTotalOrder(order);
        if (order.getCustomer() != null) {
            String note = String.format("Bỏ gán thông tin K/H %s cho đơn hàng", order.getCustomer().getCode());
            historyService.createNewHistoryObject(order, order.getStatus(), note);
        }
        order.setCustomer(null);
        return orderRepository.save(order);
    }

    public void check_validate_non_cancel_order(Order order) {
        if (order.getStatus() == Status.CANCELED) {
            throw new CustomExceptions.CustomBadRequest("Hóa đơn này đã bị hủy trước đó");
        }
    }

    @Transactional
    public Order required_cancel_online_payment_order(Integer id, HistoryRequestDTO requestDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        historyService.createNewHistoryObject(order, Status.REQUESTED, requestDTO.getNote());
        return order;
    }

    @Transactional
    public void handle_cancel_payment_online_order(Integer id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        orderRepository.delete(order);
    }

    @Transactional
    public Order handle_is_payment_online_order(Integer id, Double amount) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        if (!order.getIsPayment()) {
            order.setIsPayment(true);
            historyService.createNewHistoryObject(order, Status.PENDING, String.format("Khách hàng đã thanh toán %sđ", NumberUtil.formatCurrency(amount)));
            reloadSubTotalOrder(order);
            order.setTotalPaid(order.getTotal());
            entityManager.flush();
            reloadSubTotalOrder(order);
            sendEmail(order, "Xác nhận đã thanh toán");
            return orderRepository.save(order);
        }
        return order;
    }

    @Transactional
    public Order unLinkVoucher(Integer id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        if (order.getStatus() == Status.PENDING) {
            if (!order.getInStore() && order.getVoucher() != null) {
                increaseQuantityVoucher(order.getVoucher());
            }
            order.setVoucher(null);
            order.setDiscountVoucherPercent(0.0);
        } else {
            throw new CustomExceptions.CustomBadRequest("Không thể hủy gán phiếu giảm giá khi không ở trạng thái chờ xác nhận");
        }
        reloadSubTotalOrder(order);
        return orderRepository.save(order);
    }

    public boolean isRequiredCancelOnlinePaymentOrder(Order order) {
        List<History> histories = order.getHistories();
        if (!histories.isEmpty()) {
            History lastHistory = histories.get(histories.size() - 1);
            return lastHistory.getStatus() == Status.REQUESTED;
        }
        return false;
    }

    private void check_own_voucher(Voucher voucher) {
        Account account = AuthUtil.getAccount();
        if (account != null) {
            if (account.getCustomer() != null) {
                List<Integer> idCustomerList = voucher.getCustomers().stream().map(BaseEntity::getId).toList();
                Integer customerId = account.getCustomer().getId();
                if (voucher.getTypeTicket() == org.example.demo.entity.voucher.enums.Type.Individual && !idCustomerList.contains(customerId)) {
                    throw new CustomExceptions.CustomBadRequest("Voucher này không thuộc quyền sử dụng của bạn");
                } else {
                    log.info("VOUCHER CHO PHÉP SỬ DỤNG");
                }
            }
        } else {
            throw new CustomExceptions.CustomBadRequest("Cần đăng nhập để có thể sử dụng voucher");
        }
    }

    @Transactional
    public Order changeIsFillFeeManually(Integer orderId, boolean isManually) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy đơn hàng này"));
        order.setIsFeeManually(isManually);
        if(isManually){
            check_validate_address_for_online_order(order);
        }
        reloadSubTotalOrder(order);
        return orderRepository.save(order);
    }
}
