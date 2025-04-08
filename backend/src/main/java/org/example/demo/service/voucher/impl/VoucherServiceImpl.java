package org.example.demo.service.voucher.impl;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseV2DTO;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.entity.voucher.enums.Type;
import org.example.demo.infrastructure.common.AutoGenCode;
import org.example.demo.infrastructure.common.PageableObject;
import org.example.demo.infrastructure.converted.VoucherConvert;
import org.example.demo.mapper.voucher.response.VoucherResponseMapper;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.email.EmailService;
import org.example.demo.service.voucher.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherConvert voucherConvert;

    @Autowired
    private VoucherResponseMapper voucherResponseMapper;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AutoGenCode autoGenCode;

    @Autowired
    private OrderRepository orderRepository;


    @Override
    public List<VoucherResponse> getCustomerVoucher(Integer id, VoucherRequest request) {
        return voucherRepository.getAllVouchersWithCustomers(id, request);
    }

    @Override
    public List<VoucherResponse> getAll() {
        return voucherRepository.getPublicVoucher();
    }

    @Override
    public PageableObject<VoucherResponse> getAll(VoucherRequest request) {
        int currentPage = request.getPage() - 1; // Convert to 0-based
        currentPage = currentPage < 0 ? 0 : currentPage; // Ensure page is not negative

        Pageable pageable = PageRequest.of(currentPage, request.getSizePage());
        Page<VoucherResponse> voucherPage = voucherRepository.getAllVoucher(request, pageable);

        return new PageableObject<>(voucherPage);
    }

    @Override
    public VoucherResponseV2DTO findVoucherById(Integer id) {
        Optional<Voucher> voucherOptional = voucherRepository.findById(id);
        Voucher voucher = voucherOptional.get();
        int countOder = orderRepository.countByVoucherId(id);

        return toDTO(voucher, countOder);
    }


    public VoucherResponseV2DTO toDTO(Voucher voucher, int countOrders) {
        VoucherResponseV2DTO dto = new VoucherResponseV2DTO();
        dto.setId(voucher.getId());
        dto.setName(voucher.getName());
        dto.setCode(voucher.getCode());
        dto.setStartDate(voucher.getStartDate());
        dto.setEndDate(voucher.getEndDate());
        dto.setStatus(voucher.getStatus());
        dto.setQuantity(voucher.getQuantity());
        dto.setMaxPercent(voucher.getMaxPercent());
        dto.setMinAmount(voucher.getMinAmount());
        dto.setTypeTicket(voucher.getTypeTicket().name());

        dto.setCustomers(
                voucher.getCustomers().stream()
                        .map(BaseEntity::getId)
                        .collect(Collectors.toList())
        );

        dto.setCountOrders(countOrders);

        return dto;
    }

    private void applySorting(CriteriaBuilder cb, CriteriaQuery<Voucher> query, Root<Voucher> root, Pageable pageable) {
        List<Order> orders = new ArrayList<>();
        for (Sort.Order sortOrder : pageable.getSort()) {
            Path<Object> path = root.get(sortOrder.getProperty());
            Order order = sortOrder.isAscending() ? cb.asc(path) : cb.desc(path);
            orders.add(order);
        }
        query.orderBy(orders);
    }


    private List<Predicate> buildSearchPredicates(CriteriaBuilder cb, Root<Voucher> root, String code, String name, LocalDateTime fromDate, LocalDateTime toDate) {
        List<Predicate> predicates = new ArrayList<>();
        if (code != null && !code.isEmpty()) {
            predicates.add(cb.equal(root.get("code"), code));
        }
        if (name != null && !name.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (fromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("birthDay"), fromDate));
        }
        if (toDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("birthDay"), toDate));
        }
        return predicates;
    }

    private Long getCount(List<Predicate> predicates) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Voucher> countRoot = countQuery.from(Voucher.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private Page<VoucherResponseDTO> executePagedQuery(CriteriaQuery<Voucher> query, List<Predicate> predicates, Pageable pageable) {
        Long totalRecords = getCount(predicates);
        TypedQuery<Voucher> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Voucher> resultList = typedQuery.getResultList();
        return new PageImpl<>(voucherResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }


    @Override
    public Page<Voucher> getAllVouchers(int limit, int offset) {
        return voucherRepository.findAll(PageRequest.of(offset / limit, limit));
    }


    @Override
    public Page<Voucher> searchVoucher(String keyword, String name, String code, String typeTicket, Integer quantity,
                                       Double maxPercent, Double minAmount, String status, Pageable pageable) {
        return voucherRepository.searchVoucher(
                keyword, name, code, typeTicket, quantity, maxPercent, minAmount, status, pageable);
    }

    @Transactional
    @Override
    public VoucherResponseDTO getVoucherResponseDTO(Voucher voucher) {
        return voucherResponseMapper.toDTO(voucher);
    }

    @Override
    public Page<VoucherResponseDTO> findAllByPage(String code, String name, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Voucher> query = cb.createQuery(Voucher.class);
        Root<Voucher> root = query.from(Voucher.class);

        List<Predicate> predicates = buildSearchPredicates(cb, root, code, name, fromDate, toDate);
        query.where(predicates.toArray(new Predicate[0]));

        applySorting(cb, query, root, pageable);
        return executePagedQuery(query, predicates, pageable);
    }


    @Override
    @Transactional
    public Voucher addVoucher(VoucherRequest request) {
        if (request.getCode() == null || request.getCode().isEmpty()) {
            request.setCode(autoGenCode.genarateUniqueCode());
        }

        Voucher voucher = voucherConvert.convertRequestToEntity(request);
        Voucher voucherSaved = voucherRepository.save(voucher);
        updateStatus(voucherSaved);

        if (voucherSaved.getTypeTicket() == Type.Individual && !request.getCustomers().isEmpty()) {
            List<Integer> idCustomers = request.getCustomers();
            List<Customer> listCustomers = idCustomers.stream()
                    .map(idCustomer -> customerRepository.findById(idCustomer)
                            .orElseThrow(() -> new RuntimeException("Customer not found: " + idCustomer)))
                    .collect(Collectors.toList());
            voucherSaved.setCustomers(listCustomers);
            voucherSaved = voucherRepository.save(voucherSaved);

            sendVoucherEmailToCustomers(listCustomers, voucherSaved);
        }

        return voucherSaved;
    }

    private void sendVoucherEmailToCustomers(List<Customer> customers, Voucher voucher) {
        for (Customer customer : customers) {
            try {
                Context context = new Context();
                context.setVariable("customerName", customer.getName());
                context.setVariable("voucherCode", voucher.getCode());
                context.setVariable("voucherDescription", voucher.getMinAmount());
                context.setVariable("validUntil", voucher.getEndDate());

                emailService.sendHtmlEmail(
                        "hungit2301@gmail.com",
                        customer.getEmail(),
                        "Bạn đã nhận được Voucher",
                        "voucher-notification",
                        context
                );
            } catch (MessagingException e) {
                e.printStackTrace();
                // Xử lý lỗi gửi email
            }
        }
    }


    @Override
    @Transactional
    public VoucherResponseDTO updateVoucher(Integer id, VoucherRequest request) {

        Voucher voucherUpdate = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with ID " + id));

        int countOrdersUsingVoucher = orderRepository.countByVoucherId(id);
        if (countOrdersUsingVoucher > 0) {
            System.out.println("Number of orders using this voucher: " + countOrdersUsingVoucher);

        }

        Voucher voucherSaved = voucherConvert.convertRequestToEntity(id, request);
        updateStatus(voucherUpdate);
        if (voucherSaved.getTypeTicket() == Type.Individual && !request.getCustomers().isEmpty()) {
            List<Integer> idCustomers = request.getCustomers();
            List<Customer> listCustomers = idCustomers.stream()
                    .map(idCustomer -> customerRepository.findById(idCustomer)
                            .orElseThrow(() -> new RuntimeException("Customer not found: " + idCustomer)))
                    .collect(Collectors.toList());
            voucherSaved.setCustomers(listCustomers);
            voucherSaved = voucherRepository.save(voucherSaved);
        } else {
            voucherSaved.setCustomers(Collections.emptyList());
            voucherSaved = voucherRepository.save(voucherSaved);
        }
        voucherRepository.save(voucherSaved);
        return voucherResponseMapper.toDTO(voucherSaved, countOrdersUsingVoucher);
    }

    @Override
    public void updateStatusVoucher() {
        List<Voucher> vouchers = voucherRepository.findAll();
        for (Voucher voucher : vouchers) {
            if (voucher.getQuantity() == 0) {
                voucher.setStatus("Expired");
            } else {
                updateStatus(voucher);
            }
            voucherRepository.save(voucher);
        }
    }

    @Override
    @Transactional
    public void deleteVoucher(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher with ID not found: " + id));
        voucher.setDeleted(true);
        voucherRepository.save(voucher);
    }




    @Override
    public List<Voucher> findBetterVoucher(BigDecimal amount) {
        Sort sort;
        List<Voucher> vouchers = new ArrayList<>();
        if (amount.compareTo(BigDecimal.ZERO) == 0) {
            sort = Sort.by(Sort.Direction.ASC, "minAmount");
            vouchers = voucherRepository.findTopVouchers(sort);
        } else {
            vouchers = voucherRepository.findVoucherWithMinAmountGreaterThan(amount);
            if (vouchers.isEmpty()) {
                vouchers = voucherRepository.findBestVoucher(amount);
            }
        }
        return vouchers;
    }

    @Override
    public List<Voucher> findListAbleToUseVoucher(BigDecimal amount) {
        return voucherRepository.findListAbleToUseVoucher(amount);
    }

    public void updateStatus(Voucher voucher) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = voucher.getStartDate();
        LocalDateTime endDate = voucher.getEndDate();

        if (currentDate.isBefore(startDate)) {
            voucher.setStatus("Not started yet");
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            voucher.setStatus("In progress");
        } else {
            voucher.setStatus("Expired");
        }
        voucherRepository.save(voucher);
    }


    public List<Voucher> getSortedVouchers(Sort sort) {
        return voucherRepository.findSortAmountVouchers(sort);
    }


    @Override
    @Transactional
    public void softDeleteVoucher(Integer id, Boolean softDelete) throws Exception {
        Optional<Voucher> voucherOptional = voucherRepository.findById(id);
        if (voucherOptional.isPresent()) {
            Voucher voucher = voucherOptional.get();
            voucher.setDeleted(softDelete);
            voucherRepository.save(voucher);
        } else {
            throw new Exception("Voucher not found");
        }
    }

    @Override
    public Page<Voucher> selectPageActiveAndAbleToUseVoucher(String query, String type, Integer customerId, Pageable pageable) {
        return voucherRepository.selectPageActiveAndAbleToUseVoucher(query, type, customerId, pageable);
    }
}
