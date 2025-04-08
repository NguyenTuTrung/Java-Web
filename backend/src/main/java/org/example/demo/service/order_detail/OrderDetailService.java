package org.example.demo.service.order_detail;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.compare.OrderDetailValueCompare;
import org.example.demo.dto.order.properties.request.AllowOverrideOrderDetailRequestDTO;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.order.OrderProductDetailRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.IService;
import org.example.demo.service.order.OrderService;
import org.example.demo.util.event.EventUtil;
import org.example.demo.util.number.NumberUtil;
import org.example.demo.util.order_detail_util.OrderDetailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
public class OrderDetailService implements IService<OrderDetail, Integer, OrderDetailRequestDTO> {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderProductDetailRepository orderProductDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EntityManager entityManager;

    public List<OrderDetail> findAll() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail findById(Integer integer) {
        return orderDetailRepository.findById(integer).orElseThrow(() -> new CustomExceptions.CustomBadRequest("OrderDetail not found"));
    }

    @Override
    @Transactional
    public OrderDetail delete(Integer integer) {
        OrderDetail orderDetail = findById(integer);
        Order order = orderDetail.getOrder();
        if (order.getStatus() != Status.PENDING) {
            throw new CustomExceptions.CustomBadRequest("Hóa đơn này không còn ở trạng thái chờ xác nhận");
        }
        if (orderService.isRequiredCancelOnlinePaymentOrder(order)) {
            throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi đơn có yêu cầu hủy và hoàn trả");
        }
        ProductDetail productDetail = orderDetail.getProductDetail();
        if (orderDetail.getOrder().getStatus() != Status.CANCELED && order.getInStore()) {
            productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity());
        }
        productDetailRepository.save(productDetail);
        orderDetailRepository.delete(orderDetail);
        entityManager.flush();
        orderService.reloadSubTotalOrder(orderDetail.getOrder());
        return orderDetail;
    }

    @Override
    @Transactional
    public OrderDetail save(OrderDetailRequestDTO requestDTO) {

        int REQUIRED_QUANTITY = requestDTO.getQuantity();
        if (REQUIRED_QUANTITY <= 0) {
            throw new CustomExceptions.CustomBadRequest("Vui lòng nhập số lượng hợp lệ");
        }
        // tìm kiếm hóa đơn
        Order orderFounded = orderRepository.findById(requestDTO.getOrderId()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Không tìm thấy hóa đơn"));
        // tìm kiếm sản phẩm chi tiết
        ProductDetail productDetail = productDetailRepository.findById(requestDTO.getProductDetailId()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Product detail not found"));
        // tìm kiếm hóa đơn chi tiết
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderIdAndProductDetailId(requestDTO.getOrderId(), requestDTO.getProductDetailId());

        double currentDiscountPercent = productDetail.getProduct().getNowAverageDiscountPercentEvent();
        double currentUnitPrice = OrderDetailUtil.get_current_product_detail_price(productDetail);

        Optional<OrderDetail> entityFound = orderDetailRepository.findByOrderIdAndProductDetailIdAndAverageDiscountEventPercentAndUnitPrice(requestDTO.getOrderId(), requestDTO.getProductDetailId(), currentDiscountPercent, currentUnitPrice);

        orderService.check_validate_non_cancel_order(orderFounded);

        // NẾU CÓ BẢN GHI CŨ
        if (entityFound.isPresent()) {
            OrderDetail ORDER_DETAIL_FOUNDED = entityFound.get();
            Order ORDER_FOUND = ORDER_DETAIL_FOUNDED.getOrder();
            ProductDetail PRODUCT_DETAIL_FOUNDED = ORDER_DETAIL_FOUNDED.getProductDetail();
            int oldOrderDetailQuantity = ORDER_DETAIL_FOUNDED.getQuantity();
            int STORE_QUANTITY = PRODUCT_DETAIL_FOUNDED.getQuantity();
            boolean IS_IN_STORE_ORDER = ORDER_FOUND.getInStore();
            int cumulativeQuantity = REQUIRED_QUANTITY + oldOrderDetailQuantity;
            int ABS_RANGE_FROM_CUMULATIVE_AND_REQUIRED = Math.abs(REQUIRED_QUANTITY - cumulativeQuantity);

            if (ORDER_FOUND.getStatus() != Status.PENDING) {
                throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi không ở trạng thái chờ xác nhận");
            }
            if (orderService.isRequiredCancelOnlinePaymentOrder(ORDER_FOUND)) {
                throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi đơn có yêu cầu hủy và hoàn trả");
            }

            //================VALIDATE-QUANTITY================//
            System.out.println("REQUIRED_QUANTITY" + REQUIRED_QUANTITY);
            System.out.println("STORE_QUANTITY" + STORE_QUANTITY);
//            System.out.println("cumulativeQuantity" + cumulativeQuantity);
//            System.out.println("ABS_RANGE_FROM_CUMULATIVE_AND_REQUIRED" + ABS_RANGE_FROM_CUMULATIVE_AND_REQUIRED);
            if (IS_IN_STORE_ORDER) {
                if (STORE_QUANTITY - REQUIRED_QUANTITY >= 0) {
                    log.info("[HDTQ] - ĐỦ ĐIỀU KIỆN");
                } else {
                    log.error("[HDTQ] - KHÔNG ĐỦ ĐIỀU KIỆN");
                    throw new CustomExceptions.CustomBadRequest("#ERIB23 - Không đủ số lượng đáp ứng");
                }
            } else {
                if (STORE_QUANTITY - cumulativeQuantity >= 0) {
                    log.info("[HDTT] - ĐỦ ĐIỀU KIỆN");
                } else {
                    log.error("[HDTT] - KHÔNG ĐỦ ĐIỀU KIỆN");
                    throw new CustomExceptions.CustomBadRequest("#ERIB24 - Không đủ số lượng đáp ứng");
                }
            }
            //================VALIDATE-QUANTITY================//

            //============TRỪ SL NẾU LÀ ĐƠN TẠO QUẦY===========//
            updateQuantityStorageIfInStore(oldOrderDetailQuantity, cumulativeQuantity, productDetail, orderFounded);
            //============TRỪ SL NẾU LÀ ĐƠN TẠO QUẦY===========//

            ORDER_DETAIL_FOUNDED.setQuantity(cumulativeQuantity);
            OrderDetail response = orderDetailRepository.save(ORDER_DETAIL_FOUNDED);
            orderService.reloadSubTotalOrder(response.getOrder());
            return response;

        } else {
            OrderDetail newOrderDetail = new OrderDetail();
            // set trạng thái xóa cho hóa đơn
            newOrderDetail.setDeleted(false);

            // set số lượng
            newOrderDetail.setQuantity(REQUIRED_QUANTITY);
            // set gia trị event trung bình
            newOrderDetail.setAverageDiscountEventPercent(EventUtil.getAveragePercentEvent(productDetail.getProduct().getValidEvents()));
            // set hóa đơn vào hóa đơn chi tiết
            Order order_found = orderService.findById(requestDTO.getOrderId());
            if (order_found.getInStore()) {
                if (productDetail.getQuantity() <= 0) {
                    log.error("[HDTQ] - 01 - KHÔNG ĐỦ ĐIỀU KIỆN");
                    throw new CustomExceptions.CustomBadRequest("#ERIB28 - Không đủ số lượng đáp ứng");
                }
                if (productDetail.getQuantity() - REQUIRED_QUANTITY < 0) {
                    throw new CustomExceptions.CustomBadRequest("#ERIB38 - Không đủ số lượng đáp ứng");

                }

            }
            if (order_found.getStatus() != Status.PENDING) {
                throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi không ở trạng thái chờ xác nhận");
            }
            if (orderService.isRequiredCancelOnlinePaymentOrder(order_found)) {
                throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi đơn có yêu cầu hủy và hoàn trả");
            }
            newOrderDetail.setOrder(order_found);
            // set spct vào hóa đơn chi tiết
            newOrderDetail.setProductDetail(productDetail);
            // set giá
            newOrderDetail.setUnitPrice(OrderDetailUtil.get_current_product_detail_price(productDetail));
            // lưu lại hóa đơn chi tết
            OrderDetail response = orderDetailRepository.save(newOrderDetail);
            // cập nhật số lượng trong kho
            updateQuantityStorageIfInStore(0, REQUIRED_QUANTITY, productDetail, newOrderDetail.getOrder());
            orderService.reloadSubTotalOrder(newOrderDetail.getOrder());
            return response;

        }
    }

    @Override
    public OrderDetail update(Integer integer, OrderDetailRequestDTO requestDTO) {
        return null;
    }

    @Transactional
    public OrderDetail updateQuantity(Integer integer, int newQuantity) {
        // tìm hóa đơn chi tiết theo id
        log.info("ĐANG TÌM HÓA ĐƠN");
        OrderDetail orderDetail = findById(integer);
        log.info("ĐÃ TÌM THẤY HÓA ĐƠN");
        // tìm hóa đơn
        Order order = orderDetail.getOrder();
        if (order.getStatus() != Status.PENDING) {
            throw new CustomExceptions.CustomBadRequest("Hóa đơn này không còn ở trạng thái chờ xác nhận");
        }
        if (orderService.isRequiredCancelOnlinePaymentOrder(order)) {
            throw new CustomExceptions.CustomBadRequest("Không thể thêm sản phẩm mới khi đơn có yêu cầu hủy và hoàn trả");
        }
        orderService.check_validate_non_cancel_order(order);
        // số lương trong kho
        int quantityInStorage = orderDetail.getProductDetail().getQuantity();
        // số lượng trong hóa đơn chi tiết
        int quantityInOrder = orderDetail.getQuantity();

        // nếu số lượng mới lớn hơn trong kho và là mua thêm
        if (!isAvailableQuantityProductDetail(order.getInStore(), orderDetail.getProductDetail(), quantityInOrder, newQuantity)) {
            throw new CustomExceptions.CustomBadRequest("#97CGG Không đủ số lượng đáp ứng");
        }
        //nếu số luọng về 0
        else if (newQuantity == 0) {
            updateQuantityStorageIfInStore(quantityInOrder, newQuantity, orderDetail.getProductDetail(), order);
            // nếu đơn này đã thanh toán và là đơn online => thì chỉ xóa mềm

//            if (order.getIsPayment() && order.getType() == Type.ONLINE) {
//                orderDetail.setDeleted(true);
//                orderDetail.setQuantity(0);
//            }
//            // ngược lại xóa vĩnh viễn trưc tiếp
//            else {
//                orderDetailRepository.delete(orderDetail);
//                entityManager.flush();
//            }

            orderDetailRepository.delete(orderDetail);
            entityManager.flush();


            // cập nhật lại giá trị
            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return orderDetail;
        }
        // nếu đủ số lượng đáp ứng
        else {
            // ngăn ng dùng mua thêm với hóa đơn chi tiết có sụ thay đổi % event
            if (newQuantity > quantityInOrder) {
                double currentSaleDiscountEvent = orderDetail.getProductDetail().getProduct().getNowAverageDiscountPercentEvent();
                double currentUnitPrice = OrderDetailUtil.get_current_product_detail_price(orderDetail.getProductDetail());

                if (orderDetail.getUnitPrice() != currentUnitPrice) {
                    throw new CustomExceptions.CustomBadRequest("Sản phảm này đã có sự thay đổi về giá, vui lòng thêm sản phẩm mới ");
                }

                if (orderDetail.getAverageDiscountEventPercent() != currentSaleDiscountEvent) {
                    throw new CustomExceptions.CustomBadRequest("Sản phảm này đã có sự thay đổi % đợt giảm giá ");
                }
            }


            updateQuantityStorageIfInStore(quantityInOrder, newQuantity, orderDetail.getProductDetail(), order);
            orderDetail.setDeleted(false);
            orderDetail.setQuantity(newQuantity);
            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return orderDetailRepository.save(orderDetail);
        }
    }

    @Transactional
    public void updateQuantityStorageIfInStore(int old_quantity, int new_quantity, ProductDetail productDetail, Order order) {
        if (order.getInStore()) {
            log.info("OLD QUA: {}", old_quantity);
            log.info("NEW QUA: {}", new_quantity);
            int rangeABS = Math.abs(new_quantity - old_quantity);
            int currentQuantityOfProductDetail = productDetail.getQuantity();
            if (new_quantity > old_quantity) {
                log.info("KHÁCH MUA THEM SP MÃ {}", productDetail.getCode());
                productDetail.setQuantity(currentQuantityOfProductDetail - rangeABS);
                productDetailRepository.save(productDetail);
            } else if (new_quantity == old_quantity) {
                log.info("KHÔNG CÓ SỰ THAY ĐỔI SỐ LƯỢNG");
            }
            // nếu khách giảm bớt đi
            else {
                log.info("KHÁCH TRẢ LẠI SP MÃ {}", productDetail.getCode());
                productDetail.setQuantity(currentQuantityOfProductDetail + rangeABS);
                productDetailRepository.save(productDetail);

            }
        }
    }

    public boolean hasChangeOfPrice(Integer productDetailId, Integer orderId) {
        boolean changeOfPrice = false;
        List<OrderDetailValueCompare> orderDetailValueCompareListInThePart = new ArrayList<>();
        // lấy product detail
        Optional<ProductDetail> productDetail = productDetailRepository.findById(productDetailId);
        // lấy danh sách hóa đơm chi tiết dựa vào order id và product id
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderIdAndProductDetailId(
                orderId,
                productDetailId
        );
        //
        double currentUnitPrice = OrderDetailUtil.get_current_product_detail_price(productDetail.get());
        double currentDiscountEvent = EventUtil.getAveragePercentEvent(productDetail.get().getProduct().getValidEvents());

        OrderDetailValueCompare orderDetailValueCompareCurrent = new OrderDetailValueCompare(currentUnitPrice, currentDiscountEvent);


        for (OrderDetail orderDetail : orderDetailList) {
            double orderUnitPrice = orderDetail.getUnitPrice();
            double orderDiscountEvent = orderDetail.getAverageDiscountEventPercent();
            orderDetailValueCompareListInThePart.add(new OrderDetailValueCompare(orderUnitPrice, orderDiscountEvent));
        }

        changeOfPrice = !orderDetailValueCompareListInThePart.contains(orderDetailValueCompareCurrent);

        log.info("HAS CHANGE OF PRICE: " + changeOfPrice);
        return changeOfPrice;
    }

    public boolean checkHasChangeOfEvent(ProductDetail productDetail, List<Double> percentList) {
        double newAverageDiscountEventPercent = EventUtil.getAveragePercentEvent(productDetail.getProduct().getValidEvents());
        log.info("OLD : " + percentList.toString());
        log.info("NEW : " + newAverageDiscountEventPercent);
        return !percentList.contains(newAverageDiscountEventPercent);
    }

    private boolean isAvailableQuantityProductDetail(Boolean isInStore, ProductDetail productDetail, int currentQuantity, int requiredQuantity) {
        int quantityInStorage = productDetail.getQuantity();
        log.info("KHO : " + quantityInStorage);
        log.info("Y/C : " + requiredQuantity);
        int range = Math.abs(requiredQuantity - currentQuantity);
        // khi tổng số lượng yêu cầu lớn hơn hoặc = trong đơn hiện tại
        if (requiredQuantity >= currentQuantity) {
            // kiểm tra xem số lượng trong kho có đủ cho số lượng cần hay không
            if (isInStore) {
                return productDetail.getQuantity() - range >= 0;
            } else {
                return quantityInStorage >= requiredQuantity;
            }
        }
        // nếu tổng số lượng yêu cầu nhỏ hơn trong đơn hiện tại
        else {
            return true;
        }
    }

    public Page<OrderDetail> getPageOrderDetailByIdOrder(Integer id, Pageable pageable) {
        return orderDetailRepository.getPageOrderDetailWithPage(id, pageable);

    }


}
