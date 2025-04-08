package org.example.demo.service.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.customer.CustomerListDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface CustomerService {

    Page<CustomerListDTO> search(String searchTerm, Pageable pageable);
    Page<CustomerListDTO> searchActiveCustomer(String searchTerm, Pageable pageable);

    Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable);

    CustomerDTO getCustomerDetailById(Integer id);

    CustomerDTO saveCustomer(CustomerDTO customerDTO) throws BadRequestException;

    CustomerDTO updateCustomer(Integer id, CustomerDTO customerDTO) throws BadRequestException;

    void deleteCustomerById(Integer id);

    Customer updateStatus(Integer id, String newStatus);

    Address updateAddressDefault(Integer customerId, Integer addressId, Boolean defaultAddress);

    AddressDTO addAddressToCustomer(Integer customerId, AddressDTO addressDTO) throws BadRequestException;

    boolean isEmailExists(String email);

    boolean isPhoneExists(String phone);

    CustomerDTO getCustomerWithPagedAddresses(Integer id, int page, int size);

    AddressDTO findDefaultAddressByCustomerId(Integer customerId);

    CustomerDTO getCustomerDetailWithPageAddresses(int customerId, int page, int size);

    CustomerDTO getCustomerClientWithPageAddresses(String email, int page, int size);

}
