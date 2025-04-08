package org.example.demo.controller.voucher;


import jakarta.validation.Valid;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseV2DTO;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.entity.voucher.enums.Type;
import org.example.demo.mapper.voucher.response.VoucherResponseMapper;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.service.voucher.VoucherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping(value = "voucher")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherResponseMapper voucherResponseMapper;


    @GetMapping("/private/{id}")
    public ResponseEntity<List<VoucherResponse>> getCustomerVoucher(@PathVariable Integer id, VoucherRequest request) {
        return ResponseEntity.ok().body(voucherService.getCustomerVoucher(id, request));
    }

    @GetMapping
    public ResponseEntity<Page<VoucherResponseDTO>> getAllVoucher(
            @RequestParam(name = "limit", defaultValue = "5") int limit,
            @RequestParam(name = "offset", defaultValue = "0") int offset) {
        Page<Voucher> result = voucherService.getAllVouchers(limit, offset);
        Page<VoucherResponseDTO> response = result.map(voucherService::getVoucherResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<VoucherResponseDTO>> searchVoucher(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String typeTicket,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) Double maxPercent,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String order,
            @PageableDefault(size = 5) Pageable pageable) {

        if (sort != null && !sort.isEmpty()) {
            String sortDirection = (order != null && !order.isEmpty()) ? order.toUpperCase() : "ASC";
            Sort.Direction direction = Sort.Direction.fromString(sortDirection);
            Sort.Order orderSort = new Sort.Order(direction, sort);
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(orderSort));
        }
        else{
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "createdDate")
            );
        }
// do k duoc
        // /dung nó là string di, toi cx meo biét cast kieu gì string thi k dc
//        Type ticketType = null;
//        if (typeTicket != null && !typeTicket.isEmpty()) {
//            try {
//                ticketType = Type.valueOf(typeTicket);
//            } catch (IllegalArgumentException e) {
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ticket type.");
//            }
//        }
        // b dịnh cát vè enum à đúng r mà bth enum gán thành Sting xong uppercase lên trước t k dung, ko nó là string luon r , cái ben order toi cx dngf enum dó, nma toi ko cast vè, toi dùng luon string dó
        Page<Voucher> result = voucherService.searchVoucher(
                keyword, name, code, typeTicket, quantity, maxPercent, minAmount, status, pageable);
        Page<VoucherResponseDTO> response = result.map(voucherService::getVoucherResponseDTO);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get-all")
    public ResponseEntity<List<VoucherResponse>> getAll() {
        List<VoucherResponse> fetchVoucher = this.voucherService.getAll();
        return ResponseEntity.ok().body(fetchVoucher);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponseV2DTO> getVoucherById(@PathVariable Integer id) {
        VoucherResponseV2DTO voucherResponse = voucherService.findVoucherById(id);
        if (voucherResponse != null) {
            return ResponseEntity.ok(voucherResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVoucher(@RequestBody VoucherRequest request) {
        voucherService.addVoucher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Add voucher successfully");
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Integer id, @RequestBody VoucherRequest request) {
        try {
            VoucherResponseDTO updatedVoucher = voucherService.updateVoucher(id, request);
            return ResponseEntity.ok(updatedVoucher);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

//    @PutMapping("/delete/{id}")
//    public ResponseEntity<?> deleteVoucher(@PathVariable Integer id) {
//        try {
//            voucherService.deleteVoucher(id);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher not found");
//        }
//        return ResponseEntity.status(HttpStatus.OK).body("Delete voucher successfully");
//    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Integer id, @RequestBody Map<String, Boolean> body) {
        Boolean softDelete = body.get("softDelete");
        try {
            voucherService.softDeleteVoucher(id, softDelete);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Delete voucher successfully");
    }


    @GetMapping("/better-voucher")
    public ResponseEntity<?> findBetterVoucher(@RequestParam("amount") BigDecimal amount) {
        return ResponseEntity.ok(voucherResponseMapper.toListDTO(voucherService.findBetterVoucher(amount)));
    }

    @GetMapping("/able-voucher")
    public ResponseEntity<?> findListAbleToUseVoucher(@RequestParam("amount") BigDecimal amount) {
        return ResponseEntity.ok(voucherResponseMapper.toListDTO(voucherService.findListAbleToUseVoucher(amount)));
    }

    @GetMapping("/find-valid-voucher")
    public ResponseEntity<Page<VoucherResponseDTO>> selectPageActiveAndAbleToUseVoucherEverybody(
            @PageableDefault(size = 5, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "typeTicket", required = false, defaultValue = "") String typeTicket,
            @RequestParam(name = "customerId", required = false, defaultValue = "") Integer customerId
    ) {
        return ResponseEntity.ok(voucherService.selectPageActiveAndAbleToUseVoucher(query, typeTicket, customerId,  pageable).map(s -> voucherResponseMapper.toDTO(s)));
    }
    @GetMapping("/find-voucher")
    public ResponseEntity<Page<VoucherResponseDTO>> selectPageActive(
            @PageableDefault(size = 5, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "typeTicket", required = false, defaultValue = "") String typeTicket,
            @RequestParam(name = "customerId", required = false, defaultValue = "") Integer customerId
    ) {
        return ResponseEntity.ok(voucherService.selectPageActiveAndAbleToUseVoucher(query, typeTicket, customerId,  pageable).map(s -> voucherResponseMapper.toDTO(s)));
    }



}
