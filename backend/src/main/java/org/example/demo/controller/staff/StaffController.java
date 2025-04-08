package org.example.demo.controller.staff;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.InvalidPasswordException;
import org.example.demo.model.request.PasswordResetRequest;
import org.example.demo.model.response.ErrorResponse;
import org.example.demo.model.response.SuccessResponse;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.service.auth.AccountService;
import org.example.demo.service.email.MailSenderService;
import org.example.demo.service.staff.StaffService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailSenderService emailService;
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<Page<StaffResponseDTO>> getAllNhanVien(
            @RequestParam(name = "limit", defaultValue = "5") int limit,
            @RequestParam(name = "offset", defaultValue = "0") int offset) {
        Page<Staff> result = staffService.getAllStaffs(limit, offset);
        Page<StaffResponseDTO> response = result.map(staffService::getStaffResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<StaffResponseDTO>> searchNhanVien(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name, // hoTen
            @RequestParam(required = false) String phone, // sdt
            @RequestParam(required = false) String code, // ma
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status, // trangThai
            @RequestParam(required = false) String citizenId, // cccd
            @PageableDefault(size = 5) Pageable pageable) {

        // Log incoming parameters for debugging (optional)
        System.out.println("Searching staff with parameters: " +
                "keyword=" + keyword + ", fullName=" + name + ", phone=" + phone +
                ", code=" + code + ", email=" + email + ", status=" + status +
                ", citizenId=" + citizenId);

        // Ensure the service layer can handle the status filtering
        Page<Staff> result = staffService.searchNhanVien(
                keyword, name, phone, code, email, status, citizenId,
                pageable.getPageSize(), (int) pageable.getOffset());

        Page<StaffResponseDTO> response = result.map(staffService::getStaffResponseDTO);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Integer id) {
        try {
            StaffResponseDTO staffResponseDTO = staffService.getStaffResponseDTO(staffService.findById(id));
            return ResponseEntity.ok(staffResponseDTO);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<Void> updateStaffStatus(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be provided");
        }
        try {
            staffService.updateStatus(id, newStatus);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value", e);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }



    @PutMapping("/reset-password")
    public ResponseEntity<?> submitNewPassword(
            @RequestParam("email") String email,
            @RequestBody PasswordResetRequest resetRequest) {
        try {
            accountService.resetPassword(email, resetRequest.getNewPassword());
            return ResponseEntity.ok(new SuccessResponse("Password reset successfully"));
        } catch (DataNotFoundException e) {
            throw new CustomExceptions.CustomBadRequest("User not found");
        } catch (IllegalArgumentException e) {
            log.error("IllegalArgumentException IllegalArgumentException");
            throw new CustomExceptions.CustomBadRequest(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // b thu xem
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Unexpected error during password reset"));
        }
    }



    @PostMapping
    public ResponseEntity<StaffResponseDTO> createStaff(@Valid @RequestBody StaffRequestDTO requestDTO) throws DataNotFoundException, BadRequestException {
            Staff savedStaff = staffService.createStaff(requestDTO);
            StaffResponseDTO staffResponse = staffService.getStaffResponseDTO(savedStaff);
            return ResponseEntity.status(HttpStatus.CREATED).body(staffResponse);

    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> updateStaff(
            @PathVariable Integer id,
            @Valid @RequestBody StaffRequestDTO requestDTO) {
        try {
            StaffResponseDTO updatedStaffResponseDTO = staffService.update(id, requestDTO);
            return ResponseEntity.ok(updatedStaffResponseDTO);
        } catch (EntityNotFoundException | BadRequestException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<List<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            return ResponseEntity.badRequest().body(Collections.singletonList(Map.of("error", "Tệp rỗng hoặc không phải là tệp Excel hợp lệ.")));
        }

        try {
            List<Map<String, String>> result = staffService.importFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (StaffService.CustomException e) {
            return ResponseEntity.badRequest()
                    .body(e.getErrorMessages().stream()
                            .map(msg -> Map.of("error", msg))
                            .collect(Collectors.toList()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Vui lòng kiểm tra lại: " + e.getMessage())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Đã xảy ra lỗi không xác định: " + e.getMessage())));
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = staffService.isEmailExists(email);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // API kiểm tra số điện thoại có tồn tại hay không
    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Boolean>> checkPhone(@RequestParam String phone) {
        boolean exists = staffService.isPhoneExists(phone);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // API kiểm tra CCCD có tồn tại hay không
    @GetMapping("/check-citizenId")
    public ResponseEntity<Map<String, Boolean>> checkCitizenId(@RequestParam String citizenId) {
        boolean exists = staffService.isCitizenIdExists(citizenId);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }


}