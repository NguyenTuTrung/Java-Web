package org.example.demo.dto.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.validator.AddressValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {
    // Chuyển đổi từ Customer sang CustomerListDTO
    public static CustomerListDTO toCustomerListDTO(Customer customer) {
        Address defaultAddress = customer.getAddresses().stream()
                .filter(Address::getDefaultAddress)
                .findFirst()// lay dia chi dau tien lam mac dinh khi cung tra ve true
                .orElse(null);

        AddressDTO defaultAddressDTO = defaultAddress != null ? toAddressDTO(defaultAddress) : null;

        return new CustomerListDTO(
                customer.getId(),
                customer.getCode(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getGender(),
                customer.getBirthDate(),
                defaultAddressDTO,
                customer.getStatus()
        );
    }

    // Chuyển đổi từ CustomerDTO sang Customer entity
    public static Customer toEntityCustomer(CustomerDTO dto, String generatedCode) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setCode(generatedCode);
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setGender(dto.getGender());
        customer.setBirthDate(dto.getBirthDate());
        customer.setStatus(dto.getStatus());
        customer.setDeleted(false);

        // Chuyển đổi danh sách AddressDTO sang Address entity
        List<Address> addresses = dto.getAddressDTOS().stream()
                .map(addressDTO -> {
                    Address address = CustomerMapper.toEntityAddress(addressDTO);
                    // Thiết lập name và phone của Address từ Customer
                    address.setName(customer.getName());
                    address.setPhone(customer.getPhone());
                    return address;
                })
                .collect(Collectors.toList());

        // Gán mỗi địa chỉ với customer trước khi thiết lập danh sách địa chỉ cho customer
        addresses.forEach(address -> address.setCustomer(customer));
        customer.setAddresses(addresses);

        return customer;
    }


    // Chuyển đổi từ Customer entity sang CustomerDTO
    public static CustomerDTO toCustomerDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCode(customer.getCode());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setGender(customer.getGender());
        dto.setBirthDate(customer.getBirthDate());
        dto.setStatus(customer.getStatus());
        dto.setCreatedDate(customer.getCreatedDate());

        // Chuyển đổi danh sách Address entity sang AddressDTO
        if (customer.getAddresses() != null) {
            List<AddressDTO> addressDTOS = customer.getAddresses().stream()
                    .map(CustomerMapper::toAddressDTO)
                    .collect(Collectors.toList());
            dto.setAddressDTOS(addressDTOS);
        }
        return dto;
    }

    // Cập nhật thông tin khách hàng từ CustomerDTO
    public static void updateCustomerFromDTO(CustomerDTO dto, Customer customer, AddressValidator addressValidator) throws BadRequestException {
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setGender(dto.getGender());
        customer.setBirthDate(dto.getBirthDate());
        customer.setStatus(dto.getStatus());

        if (dto.getCode() != null) {
            customer.setCode(dto.getCode());
        }

        // Cập nhật danh sách địa chỉ
        if (dto.getAddressDTOS() != null) {
            for (AddressDTO addressDTO : dto.getAddressDTOS()) {
                // Tìm địa chỉ tương ứng trong customer hiện tại
                Address existingAddress = customer.getAddresses().stream()
                        .filter(address -> address.getId().equals(addressDTO.getId()))
                        .findFirst().orElse(null);

                if (existingAddress != null) {
                    // Cập nhật địa chỉ hiện có
                    addressValidator.validateAddress(addressDTO, existingAddress.getId());
                    updateEntityAddress(existingAddress, addressDTO);
                } else {
                    return;
                }
            }
        }
    }

    // Chuyển đổi từ AddressDTO sang Address(Tạo mới)
    public static Address toEntityAddress(AddressDTO dto) {
        Address address = new Address();
        address.setId(dto.getId());
        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setProvinceId(String.valueOf(dto.getProvinceId()));
        address.setProvince(dto.getProvince());
        address.setDistrictId(String.valueOf(dto.getDistrictId()));
        address.setDistrict(dto.getDistrict());
        address.setWardId(dto.getWardId());
        address.setWard(dto.getWard());
        address.setDetail(dto.getDetail());
        address.setDefaultAddress(dto.getIsDefault());
        return address;
    }

    // Cập nhật thực thể Address từ AddressDTO (dùng cho cập nhật)
    public static void updateEntityAddress(Address existingAddress, AddressDTO dto) {
        existingAddress.setName(dto.getName());
        existingAddress.setPhone(dto.getPhone());
        existingAddress.setProvinceId(String.valueOf(dto.getProvinceId()));
        existingAddress.setDistrictId(String.valueOf(dto.getDistrictId()));
        existingAddress.setWardId(dto.getWardId());
        existingAddress.setProvince(dto.getProvince());
        existingAddress.setDistrict(dto.getDistrict());
        existingAddress.setWard(dto.getWard());
        existingAddress.setDetail(dto.getDetail());
        existingAddress.setDefaultAddress(dto.getIsDefault());
    }

    // Chuyển đổi Address sang AddressDTO
    public static AddressDTO toAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setName(address.getName());
        dto.setPhone(address.getPhone());
        dto.setProvince(address.getProvince());
        dto.setDistrict(address.getDistrict());
        dto.setWard(address.getWard());
        dto.setProvinceId(address.getProvinceId() != null ? Integer.valueOf(address.getProvinceId()) : null);
        dto.setDistrictId(address.getDistrictId() != null ? Integer.valueOf(address.getDistrictId()) : null);
        dto.setWardId(address.getWardId());
        dto.setDetail(address.getDetail());
        dto.setIsDefault(address.getDefaultAddress());
        dto.setCreatedDate(address.getCreatedDate());
        return dto;
    }
}