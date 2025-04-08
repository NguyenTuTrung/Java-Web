package org.example.demo.service.customer.impl;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerMapper;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.security.Account;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.customer.AddressRepository;
import org.example.demo.service.customer.AddressService;
import org.example.demo.util.auth.AuthUtil;
import org.example.demo.validator.AddressValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AddressValidator addressValidator;

    @Override
    public Page<AddressDTO> getAllAddresses(Pageable pageable) {
        return addressRepository.findAllAddresses(pageable)
                .map(CustomerMapper::toAddressDTO);
    }

    @Override
    public AddressDTO getAddressById(Integer id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + id));

        return CustomerMapper.toAddressDTO(address);
    }

    @Override
    public AddressDTO updateAddress(Integer id, AddressDTO addressDTO) throws BadRequestException {
        addressValidator.validateAddress(addressDTO, id);
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + id));

        // cap nhat cac truong tu DTO vao entity
        CustomerMapper.updateEntityAddress(existingAddress, addressDTO);

        // luu vao DB
        Address updatedAddress = addressRepository.save(existingAddress);

        return CustomerMapper.toAddressDTO(updatedAddress);
    }

    @Override
    public void deleteAddress(Integer id) throws BadRequestException {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (address.getDefaultAddress()) {
            throw new CustomExceptions.CustomBadRequest("Không thể xóa địa chỉ mặc định");
        }

        addressRepository.delete(address);
    }

    @Override
    public List<AddressDTO> getMyAddressDTO() {
        List<Address> list = getMyAddress();
        return list.stream().map(CustomerMapper::toAddressDTO).toList();
    }

    @Override
    public List<Address> getMyAddress() {
        List<Address> list = new ArrayList<>();
        Account account = AuthUtil.getAccount();
        if (account != null){
            Customer customer = account.getCustomer();
            if(customer != null){
                list = addressRepository.findByCustomerId(customer.getId());
            }
        }
        return list;
    }
}
