package org.example.demo.service.staff;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.components.LocalizationUtils;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Account;
import org.example.demo.entity.security.TokenRecord;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.mapper.staff.request.StaffMapper;
import org.example.demo.mapper.staff.request.StaffRequestMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.repository.security.RoleRepository;
import org.example.demo.repository.security.TokenRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.service.email.EmailService;
import org.example.demo.service.email.MailSenderService;
import org.example.demo.service.email.PasswordGenerator;
import org.example.demo.util.MessageKeys;
import org.example.demo.validator.staff.StaffValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaffService implements IService1<Staff, Integer, StaffRequestDTO> {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private StaffResponseMapper staffResponseMapper;

    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;

    @Autowired
    private StaffRequestMapper staffRequestMapper;

    private final MailSenderService mailService;
    private final LocalizationUtils localizationUtils;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    @Autowired
    private StaffValidator staffValidator;
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public Page<StaffResponseDTO> findAllByPage(String code, String name, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Staff> query = cb.createQuery(Staff.class);
        Root<Staff> root = query.from(Staff.class);

        List<Predicate> predicates = buildSearchPredicates(cb, root, code, name, fromDate, toDate);
        query.where(predicates.toArray(new Predicate[0]));

        applySorting(cb, query, root, pageable);

        return executePagedQuery(query, predicates, pageable);
    }

    public Page<Staff> searchNhanVien(String keyword, String hoTen, String sdt, String ma, String email, String trangThai, String cccd, int limit, int offset) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        return staffRepository.searchNhanVien(keyword, hoTen, sdt, ma, email, trangThai, cccd, pageable);
    }

    public Page<Staff> getAllStaffs(int limit, int offset) {
        return staffRepository.findAll(PageRequest.of(offset / limit, limit));
    }

    private List<Predicate> buildSearchPredicates(CriteriaBuilder cb, Root<Staff> root, String code, String name, LocalDateTime fromDate, LocalDateTime toDate) {
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

    private void applySorting(CriteriaBuilder cb, CriteriaQuery<Staff> query, Root<Staff> root, Pageable pageable) {
        List<Order> orders = new ArrayList<>();
        for (Sort.Order sortOrder : pageable.getSort()) {
            Path<Object> path = root.get(sortOrder.getProperty());
            Order order = sortOrder.isAscending() ? cb.asc(path) : cb.desc(path);
            orders.add(order);
        }
        query.orderBy(orders);
    }

    private Page<StaffResponseDTO> executePagedQuery(CriteriaQuery<Staff> query, List<Predicate> predicates, Pageable pageable) {
        Long totalRecords = getCount(predicates);
        TypedQuery<Staff> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Staff> resultList = typedQuery.getResultList();
        return new PageImpl<>(staffResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }

    private Long getCount(List<Predicate> predicates) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Staff> countRoot = countQuery.from(Staff.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(countQuery).getSingleResult();
    }


    public Staff findById(Integer id) {
        return staffRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Staff with id " + id + " not found"));
    }

    private static final String DEFAULT_NV = "default";
    private static final Random RANDOM = new Random();

    private String removeVietnameseTones(String str) {
        if (str == null) {
            return null;
        }
        // Xóa dấu tiếng Việt
        str = Normalizer.normalize(str, Normalizer.Form.NFD);
        str = str.replaceAll("[\\u0300-\\u036f]", ""); // Chú ý: bỏ dấu / ở đây
        return str.replace('đ', 'd').replace('Đ', 'D');
    }

    private String generateRandomMaNV(String name) {
        if (name == null || name.isEmpty()) {
            int randomMa = 100 + RANDOM.nextInt(800);
            return DEFAULT_NV + randomMa;
        }

        name = removeVietnameseTones(name.trim());
        String[] nameParts = name.split("\\s+");

        if (nameParts.length < 2) {
            int randomMa = 100 + RANDOM.nextInt(800);
            return DEFAULT_NV + randomMa;
        }

        String ho = nameParts[0].substring(0, 1).toLowerCase(); // Chữ cái đầu của họ
        String ten = nameParts[nameParts.length - 1].toLowerCase(); // Tên
        StringBuilder tenDem = new StringBuilder();

        // Lấy chữ cái đầu của tên đệm nếu có
        for (int i = 1; i < nameParts.length - 1; i++) {
            tenDem.append(nameParts[i].substring(0, 1).toLowerCase());
        }

        // Tạo tên viết tắt theo thứ tự: tên + họ + tên đệm
        String nameInitials = ten + ho + tenDem.toString();
        int randomMa = 100 + RANDOM.nextInt(800); // Mã ngẫu nhiên từ 100 đến 899

        return nameInitials + randomMa; // Kết quả cuối cùng
    }

    private String generateRandomPassword() {
        int randomPassword = 10000 + new Random().nextInt(90000);
        return String.valueOf(randomPassword);
    }

    @Override
    @Transactional
    public Staff delete(Integer id) throws BadRequestException {
        Staff entityFound = findById(id);
        entityFound.setDeleted(true);
        return staffRepository.save(entityFound);
    }

    @Override
    @Transactional
    public Staff save(StaffRequestDTO requestDTO) throws BadRequestException {
        staffValidator.validateStaff(requestDTO, null);
        Staff entityMapped = staffRequestMapper.toEntity(requestDTO);
        entityMapped.setStatus("Active");
        entityMapped.setCode(generateRandomMaNV(requestDTO.getName()));
//        entityMapped.setPassword(generateRandomPassword());
//        entityMapped.setPassword(passwordEncoder.encode(generateRandomPassword()));
        entityMapped.setDeleted(false);
        return staffRepository.save(entityMapped);
    }


    @Transactional
    public Staff createStaff(StaffRequestDTO requestDTO) throws BadRequestException {
        staffValidator.validateStaff(requestDTO, null);

        Role role = roleRepository.findByCode("ROLE_STAFF").orElse(null);

        Account account = new Account();
        String randomPassword = PasswordGenerator.generatePassword(12);
        account.setUsername(requestDTO.getEmail());
        account.setPassword(passwordEncoder.encode(randomPassword));
        account.setStatus("Active");
        account.setEnabled(true);
        account.setRole(role);
        accountRepository.save(account);

        Staff entityMapped = staffRequestMapper.toEntity(requestDTO);
        entityMapped.setStatus("Active");
        entityMapped.setCode(generateRandomMaNV(requestDTO.getName()));
        entityMapped.setDeleted(false);
        entityMapped.setAccount(account);

        Staff savedStaff = staffRepository.save(entityMapped);
        sendWelcomeEmail(savedStaff);
        return savedStaff;
    }

    private void sendWelcomeEmail(Staff staff) {
        validateStaffForEmail(staff);

        try {
            String resetPasswordUrl = generateResetPasswordUrl(staff);
            String subject = "Khởi Đầu Hành Trình Tại Fashion Canth Shop!";
            String emailText = buildWelcomeEmailContent(staff, resetPasswordUrl);
            mailService.sendEmail(staff.getEmail(), subject, emailText);
            log.info("Welcome email sent successfully to staff member: {} ({})",
                    staff.getName(), staff.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to staff member: {} - Error: {}",
                    staff.getName(), e.getMessage(), e);
            throw new EmailSendingException("Could not send welcome email to staff", e);
        }
    }

    private void validateStaffForEmail(Staff staff) {
        Objects.requireNonNull(staff, "Staff cannot be null");
        if (staff.getEmail() == null || staff.getEmail().isBlank()) {
            throw new IllegalArgumentException("Staff email is required");
        }
        if (!isValidEmail(staff.getEmail())) {
            throw new IllegalArgumentException("Invalid email format: " + staff.getEmail());
        }
        if (staff.getName() == null || staff.getName().isBlank()) {
            throw new IllegalArgumentException("Staff name is required");
        }
    }

    private String generateResetPasswordUrl(Staff staff) {
        return UriComponentsBuilder.fromHttpUrl("http://localhost:5173/private/reset-password")
                .queryParam("email", staff.getEmail())
                .queryParam("token", generateResetPasswordToken(staff))
                .build()
                .toUriString();
    }

    private String buildWelcomeEmailContent(Staff staff, String resetPasswordUrl) {
        return String.format(
                "Xin chào %s,\n\n" +
                        "Chúng tôi rất vui mừng thông báo rằng bạn đã chính thức được nhận vào vị trí tại Fashion Canth Shop. Hành trình của bạn bắt đầu từ bây giờ!\n\n" +
                        "Chúng tôi tin tưởng vào tiềm năng của bạn và mong đợi những đóng góp tích cực từ bạn.\n\n" +
                        "Thông tin tài khoản của bạn:\n" +
                        "- Mã nhân viên: %s\n" +
                        "- Email đăng nhập: %s\n\n" +
                        "Để kích hoạt tài khoản, vui lòng nhấn vào liên kết dưới đây để thiết lập mật khẩu mới:\n" +
                        "%s\n\n" +
                        "Liên kết này sẽ hết hạn trong vòng 24 giờ. Nếu bạn không thực hiện được, vui lòng liên hệ bộ phận hỗ trợ.\n\n" +
                        "Chúng tôi mong chờ được làm việc cùng bạn!\n\n" +
                        "Trân trọng,\n" +
                        "Đội ngũ Fashion Canth Shop",
                staff.getName(),
                staff.getCode(),
                staff.getEmail(),
                resetPasswordUrl
        );
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    public class EmailSendingException extends RuntimeException {
        public EmailSendingException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    private String generateResetPasswordToken(Staff staff) {
        return UUID.randomUUID().toString();
    }

    @Override
    @Transactional
    public StaffResponseDTO update(Integer id, StaffRequestDTO requestDTO) throws BadRequestException {
        Staff existingStaff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));
        staffValidator.validateStaff(requestDTO, id);
        staffRequestMapper.updateEntity(requestDTO, existingStaff);
        Staff updatedStaff = staffRepository.save(existingStaff);
        return staffResponseMapper.toDTO(updatedStaff);
    }

    @Transactional
    public StaffResponseDTO getStaffResponseDTO(Staff staff) {
        return staffResponseMapper.toDTO(staff);
    }

    @Transactional
    public Staff updateStatus(Integer id, String newStatus) {
        if (!"Active".equalsIgnoreCase(newStatus) && !"Inactive".equalsIgnoreCase(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));
        staff.setStatus(newStatus);
        if (staff.getStatus().equalsIgnoreCase("Inactive")) {
            staff.setDeleted(true);
        } else {
            staff.setDeleted(false);
        }
        return staffRepository.save(staff);
    }

//    @Transactional
//    public List<Map<String, String>> importFromExcel(MultipartFile file) throws IOException {
//        List<Map<String, String>> responseList = new ArrayList<>();
//        List<Staff> staffList = new ArrayList<>();
//        List<String> errorMessages = new ArrayList<>();
//
//        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
//            Sheet sheet = workbook.getSheetAt(0);
//
//            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
//                Row row = sheet.getRow(i);
//                if (row == null) continue;
//
//                StaffRequestDTO staffDTO = new StaffRequestDTO();
//                staffDTO.setName(getCellValue(row.getCell(1)));
//                staffDTO.setEmail(getCellValue(row.getCell(2)));
//                staffDTO.setPhone(getCellValue(row.getCell(3)));
//                staffDTO.setAddress(getCellValue(row.getCell(4)));
//                staffDTO.setWard(getCellValue(row.getCell(5)));
//                staffDTO.setDistrict(getCellValue(row.getCell(6)));
//                staffDTO.setProvince(getCellValue(row.getCell(7)));
//                staffDTO.setCitizenId(getCellValue(row.getCell(8)));
//
//                String statusValue = getCellValue(row.getCell(9)).trim();
//                String statusString = "Inactive";
//
//                // Xử lý trạng thái
//                if ("Hoạt động".equalsIgnoreCase(statusValue) || "Active".equalsIgnoreCase(statusValue)) {
//                    statusString = "Active";
//                }
//                staffDTO.setStatus(statusString);
//
//                // Xử lý ngày sinh
//                if (row.getCell(10) != null && DateUtil.isCellDateFormatted(row.getCell(10))) {
//                    LocalDate birthDate = row.getCell(10).getDateCellValue().toInstant()
//                            .atZone(ZoneId.systemDefault()).toLocalDate();
//                    staffDTO.setBirthDay(birthDate);
//                }
//
//                staffDTO.setGender("Nam".equalsIgnoreCase(getCellValue(row.getCell(11))));
//                staffDTO.setNote(getCellValue(row.getCell(12)));
//                staffDTO.setDeleted("Không".equalsIgnoreCase(getCellValue(row.getCell(13))));
//                String code = generateRandomMaNV(staffDTO.getName());
//                String password = generateRandomPassword();
//                staffDTO.setCode(code);
//
//                // Kiểm tra lỗi trước khi thêm vào danh sách staffList
//                try {
//                    staffValidator.validateStaff(staffDTO, null);
//
//                    // Kiểm tra xem email, phone, citizenId có tồn tại không
//                    if (isEmailExists(staffDTO.getEmail())) {
//                        errorMessages.add("Dòng " + (i + 1) + ": Email đã tồn tại trong hệ thống.");
//                    }
//                    if (isPhoneExists(staffDTO.getPhone())) {
//                        errorMessages.add("Dòng " + (i + 1) + ": Số điện thoại đã tồn tại trong hệ thống.");
//                    }
//                    if (isCitizenIdExists(staffDTO.getCitizenId())) {
//                        errorMessages.add("Dòng " + (i + 1) + ": CCCD đã tồn tại trong hệ thống.");
//                    }
//
//                    // Nếu không có lỗi, thêm vào danh sách staffList
//                    if (errorMessages.isEmpty()) {
//                        Staff staff = StaffMapper.toEntity(staffDTO);
//                        staffList.add(staff);
//
//                        Map<String, String> responseData = new HashMap<>();
//                        responseData.put("name", staffDTO.getName());
//                        responseData.put("email", staffDTO.getEmail());
//                        responseData.put("code", staffDTO.getCode());
//                        responseList.add(responseData);
//                    }
//
//                } catch (IllegalArgumentException e) {
//                    errorMessages.add("Dòng " + (i + 1) + ": " + e.getMessage());
//                }
//            }
//
//            // Nếu có lỗi, không lưu dữ liệu
//            if (!errorMessages.isEmpty()) {
//                log.warn("Lỗi khi import nhân viên từ Excel: \n" + String.join("\n", errorMessages));
//                throw new CustomException(errorMessages); // Ném ngoại lệ nếu có lỗi
//            }
//
//            // Lưu danh sách nhân viên nếu không có lỗi
//            if (!staffList.isEmpty()) {
//                staffRepository.saveAll(staffList);
//            }
//        }
//
//        return responseList; // Trả về danh sách phản hồi
//    }


    private StaffRequestDTO mapRowToStaffDTO(Row row) {
        StaffRequestDTO staffDTO = new StaffRequestDTO();

        staffDTO.setName(getCellValue(row.getCell(1)));
        staffDTO.setEmail(getCellValue(row.getCell(2)));
        staffDTO.setPhone(getCellValue(row.getCell(3)));
        staffDTO.setAddress(getCellValue(row.getCell(4)));
        staffDTO.setWard(getCellValue(row.getCell(5)));
        staffDTO.setDistrict(getCellValue(row.getCell(6)));
        staffDTO.setProvince(getCellValue(row.getCell(7)));
        staffDTO.setCitizenId(getCellValue(row.getCell(8)));

        // Status handling
        String statusValue = getCellValue(row.getCell(9)).trim();
        staffDTO.setStatus("Hoạt động".equalsIgnoreCase(statusValue) ||
                "Active".equalsIgnoreCase(statusValue) ? "Active" : "Inactive");

        // Birth date handling
        if (row.getCell(10) != null && DateUtil.isCellDateFormatted(row.getCell(10))) {
            LocalDate birthDate = row.getCell(10).getDateCellValue().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            staffDTO.setBirthDay(birthDate);
        }

        // Additional fields
        staffDTO.setGender("Nam".equalsIgnoreCase(getCellValue(row.getCell(11))));
        staffDTO.setNote(getCellValue(row.getCell(12)));
        staffDTO.setDeleted(!"Không".equalsIgnoreCase(getCellValue(row.getCell(13))));

        return staffDTO;
    }

    private void validateStaffData(StaffRequestDTO staffDTO, int rowIndex, List<String> errorMessages) {
        try {
            // Validate staff data
            staffValidator.validateStaff(staffDTO, null);

            // Check for existing email, phone, citizen ID
            if (isEmailExists(staffDTO.getEmail())) {
                errorMessages.add("Dòng " + (rowIndex + 1) + ": Email đã tồn tại trong hệ thống.");
            }
            if (isPhoneExists(staffDTO.getPhone())) {
                errorMessages.add("Dòng " + (rowIndex + 1) + ": Số điện thoại đã tồn tại trong hệ thống.");
            }
            if (isCitizenIdExists(staffDTO.getCitizenId())) {
                errorMessages.add("Dòng " + (rowIndex + 1) + ": CCCD đã tồn tại trong hệ thống.");
            }
        } catch (IllegalArgumentException | BadRequestException e) {
            errorMessages.add("Dòng " + (rowIndex + 1) + ": " + e.getMessage());
        }
    }

    @Transactional
    public List<Map<String, String>> importFromExcel(MultipartFile file) throws IOException {
        List<Map<String, String>> successfulImports = new ArrayList<>();
        List<Staff> staffToSave = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;

                try {
                    StaffRequestDTO staffDTO = mapRowToStaffDTO(row);
                    validateStaffData(staffDTO, rowIndex, errorMessages);

                    if (errorMessages.isEmpty()) {
                        Account account = createAccountForStaff(staffDTO);

                        Staff staff = processValidStaff(staffDTO, account);
                        staffToSave.add(staff);

                        Map<String, String> successResponse = new HashMap<>();
                        successResponse.put("name", staffDTO.getName());
                        successResponse.put("email", staffDTO.getEmail());
                        successResponse.put("code", staffDTO.getCode());
                        successfulImports.add(successResponse);
                    }
                } catch (Exception e) {
                    log.error("Lỗi khi import dòng {}: {}", rowIndex + 1, e.getMessage(), e);
                    errorMessages.add("Dòng " + (rowIndex + 1) + ": " + e.getMessage());
                }
            }

            if (!errorMessages.isEmpty()) {
                log.warn("Lỗi trong quá trình import nhân viên: \n" + String.join("\n", errorMessages));
                throw new CustomException(errorMessages);
            }

            if (!staffToSave.isEmpty()) {
                List<Account> accounts = staffToSave.stream()
                        .map(Staff::getAccount)
                        .collect(Collectors.toList());
                accountRepository.saveAll(accounts);

                staffRepository.saveAll(staffToSave);
            }
        }

        return successfulImports;
    }

    private Account createAccountForStaff(StaffRequestDTO staffDTO) {
        Role role = roleRepository.findByCode("ROLE_STAFF")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò STAFF"));

        String randomPassword = PasswordGenerator.generatePassword(12);

        Account account = new Account();
        account.setUsername(staffDTO.getEmail());
        account.setPassword(passwordEncoder.encode(randomPassword));
        account.setStatus("Active");
        account.setEnabled(true);
        account.setRole(role);


        return account;
    }

    private Staff processValidStaff(StaffRequestDTO staffDTO, Account account) {
        try {
            // Sinh mã nhân viên
            String code = generateRandomMaNV(staffDTO.getName());
            staffDTO.setCode(code);

            // Chuyển đổi DTO sang entity
            Staff staff = StaffMapper.toEntity(staffDTO);

            // Gán account
            staff.setAccount(account);
            staff.setStatus("Active");

            return staff;
        } catch (Exception e) {
            log.error("Lỗi chuyển đổi staff DTO sang entity", e);
            throw new RuntimeException("Không thể chuyển đổi dữ liệu nhân viên: " + e.getMessage(), e);
        }
    }


    public class CustomException extends RuntimeException {
        private final List<String> errorMessages;

        public CustomException(List<String> errorMessages) {
            super(String.join(", ", errorMessages));
            this.errorMessages = errorMessages;
        }

        public List<String> getErrorMessages() {
            return errorMessages;
        }
    }


    private String getCellValue(Cell cell) {
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                } else {
                    yield String.valueOf((long) cell.getNumericCellValue());
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    public boolean isEmailExists(String email) {
        return staffValidator.isEmailExists(email);
    }

    public boolean isPhoneExists(String phone) {
        return staffValidator.isPhoneExists(phone);
    }

    public boolean isCitizenIdExists(String citizenId) {
        return staffValidator.isCitizenIdExists(citizenId);
    }

}