package org.example.demo.validator;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.repository.customer.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class AddressValidator {

    public void validateAddress(AddressDTO addressDTO, Integer existingAddressId) throws BadRequestException {
        if (addressDTO == null) {
            throw new BadRequestException("Dữ liệu địa chỉ không để trống");
        }

        validateName(addressDTO.getName());
        validateDetail(addressDTO.getDetail());
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


    private void validateDetail(String detail) throws BadRequestException {
        if (!StringUtils.hasText(detail)) {
            throw new BadRequestException("Địa chỉ chi tết không được để trống");
        }
    }
}
