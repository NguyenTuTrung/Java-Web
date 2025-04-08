package org.example.demo.service.customer.impl;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.*;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.infrastructure.common.AutoGenCode;
import org.example.demo.repository.customer.AddressRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.service.customer.CustomerService;
import org.example.demo.validator.AddressValidator;
import org.example.demo.validator.CustomerValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AutoGenCode autoGenCode;

    @Autowired
    private CustomerValidator customerValidator;

    @Autowired
    private AddressValidator addressValidator;


    @Override
    public Page<CustomerListDTO> search(String searchTerm, Pageable pageable) {
        return customerRepository.search(searchTerm, pageable)
                .map(CustomerMapper::toCustomerListDTO);
    }

    @Override
    public Page<CustomerListDTO> searchActiveCustomer(String searchTerm, Pageable pageable) {
        return customerRepository.searchActive(searchTerm, pageable)
                .map(CustomerMapper::toCustomerListDTO);
    }

    @Override
    public Page<CustomerListDTO> getAllCustomers(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return customerRepository.findByStatus(status, pageable)
                    .map(CustomerMapper::toCustomerListDTO);
        }
        return customerRepository.findAllCustomers(pageable)
                .map(CustomerMapper::toCustomerListDTO);
    }

    @Override
    public CustomerDTO getCustomerDetailById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return CustomerMapper.toCustomerDTO(customer);
    }


    @Override
    @Transactional
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) throws BadRequestException {

        customerValidator.validateCustomer(customerDTO, null);

        // Tạo mã khách hàng nếu không có
        String generatedCode = customerDTO.getCode() == null || customerDTO.getCode().isEmpty()
                ? autoGenCode.genarateUniqueCode() : customerDTO.getCode();

        // Chuyển đổi DTO sang entity Customer
        Customer customer = CustomerMapper.toEntityCustomer(customerDTO, generatedCode);

        // Lưu Customer vào database
        Customer savedCustomer = customerRepository.save(customer);

        // Chuyển đổi entity Customer đã lưu sang DTO để trả về
        return CustomerMapper.toCustomerDTO(savedCustomer);
    }

    @Override
    public CustomerDTO updateCustomer(Integer id, CustomerDTO customerDTO) throws BadRequestException {
        Optional<Customer> customerOptional = customerRepository.findById(id);
        if (customerOptional.isPresent()) {
            Customer existingCustomer = customerOptional.get();

            // Gọi validator để kiểm tra dữ liệu
            customerValidator.validateCustomer(customerDTO, id);

            // Cập nhật thông tin khách hàng và địa chỉ dựa trên DTO
            CustomerMapper.updateCustomerFromDTO(customerDTO, existingCustomer, addressValidator);

            // Lưu khách hàng đã cập nhật
            Customer updatedCustomer = customerRepository.save(existingCustomer);
            return CustomerMapper.toCustomerDTO(updatedCustomer);
        } else {
            throw new RuntimeException("Không tìm thấy khách hàng với id: " + id);
        }
    }

    @Override
    public CustomerDTO getCustomerWithPagedAddresses(Integer customerId, int page, int size) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy khách hàng với id: " + customerId);
        }

        Customer customer = customerOptional.get();

        // Phân trang địa chỉ của khách hàng
        List<Address> allAddresses = customer.getAddresses();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allAddresses.size());
        List<Address> pagedAddresses = allAddresses.subList(startIndex, endIndex);

        // Chuyển đổi thành DTO
        List<AddressDTO> pagedAddressDTOS = pagedAddresses.stream()
                .map(CustomerMapper::toAddressDTO)
                .collect(Collectors.toList());

        // Trả về DTO của khách hàng với các địa chỉ được phân trang
        CustomerDTO customerDTO = CustomerMapper.toCustomerDTO(customer);
        customerDTO.setAddressDTOS(pagedAddressDTOS);

        // Bạn có thể thêm thông tin về tổng số trang hoặc địa chỉ tại đây nếu cần
        customerDTO.setTotalAddresses(allAddresses.size());

        return customerDTO;
    }


    @Override
    public void deleteCustomerById(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found width id " + id);
        }
        customerRepository.deleteById(id);
    }

    @Transactional
    public Customer updateStatus(Integer id, String newStatus) {
        // Validate the new status value
        if (!"Active".equalsIgnoreCase(newStatus) && !"Inactive".equalsIgnoreCase(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        // Fetch the customer entity by ID
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));

        // Update the status
        customer.setStatus(newStatus);

        // Save the updated staff entity
        return customerRepository.save(customer);
    }

    @Transactional
    @Override
    public Address updateAddressDefault(Integer customerId, Integer addressId, Boolean defaultAddress) {
        // Lấy tất cả các địa chỉ của khách hàng
        List<Address> customerAddresses = addressRepository.findByCustomerId(customerId);

        // Nếu địa chỉ mới được đặt làm mặc định
        if (defaultAddress) {
            // Đặt tất cả các địa chỉ khác thành không mặc định
            for (Address address : customerAddresses) {
                if (!address.getId().equals(addressId)) { // Chỉ đặt các địa chỉ khác
                    address.setDefaultAddress(false);
                    addressRepository.save(address); // Lưu ngay lập tức từng địa chỉ đã thay đổi
                }
            }
        } else {
            // Nếu địa chỉ được chọn không làm mặc định, kiểm tra xem có ít nhất một địa chỉ nào đó là mặc định không
            boolean hasDefaultAddress = customerAddresses.stream()
                    .anyMatch(Address::getDefaultAddress);

            // Nếu không có địa chỉ mặc định, ném ngoại lệ
            if (!hasDefaultAddress) {
                throw new IllegalStateException("At least one address must be set as default.");
            }
        }

        // Tìm địa chỉ cần cập nhật (nếu địa chỉ không tồn tại, ném ngoại lệ)
        Address addressToUpdate = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + addressId));

        // Cập nhật giá trị isDefault cho địa chỉ được chọn
        addressToUpdate.setDefaultAddress(defaultAddress);

        // Lưu địa chỉ đang được cập nhật (vì đã thay đổi giá trị isDefault)
        return addressRepository.save(addressToUpdate);
    }


    @Override
    public AddressDTO addAddressToCustomer(Integer customerId, AddressDTO addressDTO) throws BadRequestException {
        addressValidator.validateAddress(addressDTO, null);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + customerId));

        // Tạo và thiết lập địa chỉ mới
        Address newAddress = CustomerMapper.toEntityAddress(addressDTO);
        newAddress.setCreatedDate(LocalDateTime.now());
        // Liên kết địa chỉ mới với khách hàng
        newAddress.setCustomer(customer);

        // Thêm địa chỉ vào cơ sở dữ liệu
        addressRepository.save(newAddress);

        // Trả về AddressDTO
        return CustomerMapper.toAddressDTO(newAddress);
    }

    @Override
    public AddressDTO findDefaultAddressByCustomerId(Integer customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> customer.getAddresses().stream()
                        .filter(Address::getDefaultAddress) // Lọc địa chỉ mặc định
                        .findFirst()
                        .map(CustomerMapper::toAddressDTO) // Ánh xạ sang AddressDTO
                        .orElse(null))
                .orElse(null);
    }

    @Override
    public CustomerDTO getCustomerDetailWithPageAddresses(int customerId, int page, int size) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + customerId));

        // Sử dụng Mapper để chuyển đổi Customer ---> DTO
        CustomerDTO customerDTO = CustomerMapper.toCustomerDTO(customer);

        // lấy danh sách địa chỉ phân trang
        Pageable pageable = PageRequest.of(page, size);
        Page<Address> addressPage = addressRepository.findAddressesByCustomerId(customerId, pageable);

        // chuyển đổi danh sách địa chỉ sang DTO
        List<AddressDTO> addressDTOS = addressPage.getContent().stream()
                .map(CustomerMapper::toAddressDTO)
                .collect(Collectors.toList());

        // Thiết lập danh sách địa chỉ và tổng số địa chỉ vào DTO khách hàng
        customerDTO.setAddressDTOS(addressDTOS);
        customerDTO.setTotalAddresses((int) addressPage.getTotalElements());

        return customerDTO;
    }

    @Override
    public CustomerDTO getCustomerClientWithPageAddresses(String email, int page, int size) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found width id " + email));
        CustomerDTO customerDTO = CustomerMapper.toCustomerDTO(customer);
        Pageable pageable = PageRequest.of(page, size);
        Page<Address> addressPage = addressRepository.findAddressesByCustomerEmail(email, pageable);
        List<AddressDTO> addressDTOS = addressPage.getContent().stream()
                .map(CustomerMapper::toAddressDTO)
                .collect(Collectors.toList());
        customerDTO.setAddressDTOS(addressDTOS);
        customerDTO.setTotalAddresses((int) addressPage.getTotalElements());
        return customerDTO;
    }

    // Các phương thức kiểm tra trực tiếp
    public boolean isEmailExists(String email) {
        return customerValidator.isEmailExists(email);
    }

    public boolean isPhoneExists(String phone) {
        return customerValidator.isPhoneExists(phone);
    }
}
