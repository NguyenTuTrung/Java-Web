package org.example.demo.service.voucher;


import jakarta.transaction.Transactional;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseV2DTO;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.entity.voucher.enums.Type;
import org.example.demo.infrastructure.common.PageableObject;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface VoucherService {

    List<VoucherResponse> getCustomerVoucher(Integer id, VoucherRequest request);

    List<VoucherResponse> getAll();

    PageableObject<VoucherResponse> getAll(VoucherRequest request);

    VoucherResponseV2DTO findVoucherById(Integer id);

    Page<Voucher> getAllVouchers(int limit, int offset);

    VoucherResponseDTO getVoucherResponseDTO(Voucher vocher);

    Page<VoucherResponseDTO> findAllByPage(
            String code,
            String name,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Pageable pageable);

    Voucher addVoucher(VoucherRequest request);

    Page<Voucher> searchVoucher(String keyword, String name, String code, String typeTicket, Integer quantity, Double maxPercent, Double minAmount, String status, Pageable pageable);

    //    Voucher updateVoucher(Integer id, VoucherRequest request);
    VoucherResponseDTO updateVoucher(Integer id, VoucherRequest request);

    void updateStatusVoucher();

    void deleteVoucher(Integer id);


    List<Voucher> findBetterVoucher(BigDecimal amount);

    List<Voucher> findListAbleToUseVoucher(BigDecimal amount);

    List<Voucher> getSortedVouchers(Sort sort);

    void softDeleteVoucher(Integer id, Boolean softDelete) throws Exception;

    Page<Voucher> selectPageActiveAndAbleToUseVoucher(String query, String type, Integer customerId, Pageable pageable);

}
