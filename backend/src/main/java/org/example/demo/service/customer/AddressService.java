package org.example.demo.service.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AddressService {

    Page<AddressDTO> getAllAddresses(Pageable pageable);

    AddressDTO getAddressById(Integer id);

    AddressDTO updateAddress(Integer id, AddressDTO addressDTO) throws BadRequestException;

    void deleteAddress(Integer id) throws BadRequestException;

    List<AddressDTO> getMyAddressDTO();
    List<Address> getMyAddress();
}
