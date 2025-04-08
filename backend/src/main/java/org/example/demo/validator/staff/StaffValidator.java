package org.example.demo.validator.staff;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class StaffValidator {

    @Autowired
    private StaffRepository staffRepository;

    public void validateStaff(StaffRequestDTO staffRequestDTO, Integer existingStaffId) throws BadRequestException {
        if (staffRequestDTO == null) {
            throw new BadRequestException("Dữ liệu nhân viên không để trống");
        }

        validateName(staffRequestDTO.getName());
        validateEmail(staffRequestDTO.getEmail(), existingStaffId);
        validatePhone(staffRequestDTO.getPhone(), existingStaffId);
        validateCitizenId(staffRequestDTO.getCitizenId(), existingStaffId);
    }

    private void validateName(String name) throws BadRequestException {
        if (!StringUtils.hasText(name)) {
            throw new BadRequestException("Tên không để trống");
        }
        // Kiểm tra khoảng trắng thừa
        if (!name.trim().equals(name) || name.contains("  ")) {
            throw new BadRequestException("Tên không được chứa khoảng trắng ở đầu, cuối hoặc nhiều khoảng trắng liên tiếp");
        }
        if (!name.matches("^[\\p{L}\\s]+$")) {
            throw new BadRequestException("Tên không được chứa ký tự đặc biệt hoặc số");
        }
        if (name.length() < 3 || name.length() > 50) {
            throw new BadRequestException("Tên phải lớn hơn 3 ký tự và không quá 50 ký tự");
        }
    }

    private void validateEmail(String email, Integer existingStaffId) throws BadRequestException {
        if (!StringUtils.hasText(email)) {
            throw new BadRequestException("Email không để trống");
        }
        email = email.trim(); // xóa khoảng trắng ở đầu và cuối

        // Biểu thức chính quy cho email
        if (!email.matches("^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new BadRequestException("Email không đúng định dạng");
        }

        // Kiểm tra nếu tồn tại nhiều nhân viên có cùng email
        List<Staff> staffs = staffRepository.findStaffByEmail(email);
        for (Staff staff : staffs) {
            // Nếu tìm thấy nhân viên có email này mà không phải nhân viên đang cập nhật
            if (!staff.getId().equals(existingStaffId)) {
                throw new BadRequestException(String.format("Email của %s (%s) đã tồn tại trong danh sách", staff.getName(), email));
            }
        }
    }

    private void validatePhone(String phone, Integer existingStaffId) throws BadRequestException {
        if (!StringUtils.hasText(phone)) {
            throw new BadRequestException("Số điện thoại không được để trống");
        }
        if (!phone.matches("^[0-9]{10}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ");
        }
        // Kiểm tra nếu tồn tại nhiều nhân viên có cùng số điện thoại
        List<Staff> staffs = staffRepository.findStaffByPhone(phone);
        for (Staff staff : staffs) {
            // Nếu tìm thấy nhân viên có số điện thoại này mà không phải nhân viên đang cập nhật
            if (!staff.getId().equals(existingStaffId)) {
                throw new BadRequestException(String.format("Số điện thoại của %s (%s) đã tồn tại trong danh sách", staff.getName(), phone));
            }
        }
    }

    private void validateCitizenId(String citizenId, Integer existingStaffId) throws BadRequestException {
        if (!StringUtils.hasText(citizenId)) {
            throw new BadRequestException("CCCD không được để trống");
        }
        if (!citizenId.matches("^[0-9]{12}$")) {
            throw new BadRequestException("CCCD không hợp lệ");
        }
        // Kiểm tra nếu tồn tại nhiều nhân viên có cùng CCCD
        List<Staff> staffs = staffRepository.findStaffByCitizenId(citizenId);
        for (Staff staff : staffs) {
            // Nếu tìm thấy nhân viên có CCCD này mà không phải nhân viên đang cập nhật
            if (!staff.getId().equals(existingStaffId)) {
                throw new BadRequestException(String.format("CCCD của %s (%s) đã tồn tại trong danh sách", staff.getName(), citizenId));
            }
        }
    }

    public boolean isEmailExists(String email) {
        return !staffRepository.findStaffByEmail(email).isEmpty();
    }

    public boolean isPhoneExists(String phone) {
        return !staffRepository.findStaffByPhone(phone).isEmpty();
    }

    public boolean isCitizenIdExists(String citizenId) {
        return !staffRepository.findStaffByCitizenId(citizenId).isEmpty();
    }
}
