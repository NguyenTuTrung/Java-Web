package org.example.demo.controller.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.customer.CustomerListDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.service.customer.CustomerService;
import org.example.demo.validator.AddressValidator;
import org.example.demo.validator.CustomerValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;


    @GetMapping("/search")
    public ResponseEntity<Page<CustomerListDTO>> getCustomersSearch(@RequestParam(defaultValue = "") String query, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CustomerListDTO> customerDTOS = customerService.search(query, pageable);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping("/search-active")
    public ResponseEntity<Page<CustomerListDTO>> getActiveCustomersSearch(@RequestParam(defaultValue = "") String query, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CustomerListDTO> customerDTOS = customerService.searchActiveCustomer(query, pageable);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping
    public ResponseEntity<Page<CustomerListDTO>> getCustomers(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size, @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CustomerListDTO> customerDTOS = customerService.getAllCustomers(status, pageable);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerDetailById(@PathVariable("id") Integer id) {
        CustomerDTO customerDTO = customerService.getCustomerDetailById(id);
        return ResponseEntity.ok(customerDTO);
    }

    // API kiểm tra email có tồn tại hay không
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = customerService.isEmailExists(email);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // API kiểm tra số điện thoại có tồn tại hay không
    @GetMapping("/check-phone")
    public ResponseEntity<Map<String, Boolean>> checkPhone(@RequestParam String phone) {
        boolean exists = customerService.isPhoneExists(phone);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // API lấy chi tiết khách hàng cùng địa chỉ phân trang
    @GetMapping("/{customerId}/detail")
    public ResponseEntity<CustomerDTO> getCustomerDetailWithAddress(@PathVariable int customerId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
        CustomerDTO customerDTO = customerService.getCustomerDetailWithPageAddresses(customerId, page, size);
        return ResponseEntity.ok(customerDTO);
    }

    @GetMapping("/customer-infor/{email}")
    public ResponseEntity<CustomerDTO> getCustomerInfoClient(@PathVariable("email") String email, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
        CustomerDTO customerDTO = customerService.getCustomerClientWithPageAddresses(email, page, size);
        return ResponseEntity.ok(customerDTO);
    }



    @GetMapping("/customer/{id}/addresses")
    public ResponseEntity<CustomerDTO> getCustomerWithPagedAddresses(@PathVariable Integer id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "2") int size) {
        CustomerDTO customerDTO = customerService.getCustomerWithPagedAddresses(id, page, size);
        return ResponseEntity.ok(customerDTO);
    }

    // lấy địa chỉ mặc định của 1 khách hàng
    @GetMapping("/{customerId}/default-address")
    public ResponseEntity<AddressDTO> getDefaultAddress(@PathVariable Integer customerId) {
        AddressDTO defaultAddress = customerService.findDefaultAddressByCustomerId(customerId);

        if (defaultAddress != null) {
            return ResponseEntity.ok(defaultAddress);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerDTO> saveCustomer(@RequestBody CustomerDTO customerDTO) throws BadRequestException {
        try {
            CustomerDTO customer = customerService.saveCustomer(customerDTO);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // API thêm mới địa chỉ cho khách hàng
    @PostMapping("/{id}/address")
    public ResponseEntity<AddressDTO> addAddressToCustomer(@PathVariable int id, @RequestBody AddressDTO addressDTO) throws BadRequestException {
        AddressDTO newAddress = customerService.addAddressToCustomer(id, addressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAddress);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Integer id, @RequestBody CustomerDTO customerDTO) throws BadRequestException {
        try {
            CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<Void> updateStaffStatus(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        customerService.updateStatus(id, newStatus);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<Address> updateDefaultAddress(@PathVariable Integer addressId, @RequestParam("customerId") Integer customerId, @RequestParam("isDefault") Boolean defaultAddress) {
        // Gọi service để cập nhật địa chỉ mặc định
        Address updatedAddress = customerService.updateAddressDefault(customerId, addressId, defaultAddress);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomerById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
