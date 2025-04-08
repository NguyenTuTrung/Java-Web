package org.example.demo.model.request;

import org.example.demo.dto.voucher.request.VoucherRequestDTO;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface VoucherRequestMapper extends IMapperBasic<Voucher, VoucherRequestDTO> {

    // Mapping DTO to Entity
    @Override
    @Mapping(target = "customers", source = "customers", qualifiedByName = "customerIdsToCustomers")
    Voucher toEntity(VoucherRequestDTO dto);

    // Updating an existing entity with DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "customers", source = "customers", qualifiedByName = "customerIdsToCustomers")
    void updateEntity(VoucherRequestDTO dto, @MappingTarget Voucher entity);

    // Custom mapping method to map List<Integer> to List<Customer> (used in entity conversion)
    @Named("customerIdsToCustomers")
    default List<Customer> customerIdsToCustomers(List<Integer> customerIds) {
        return customerIds.stream().map(id -> {
            Customer customer = new Customer();
            customer.setId(id);
            return customer;
        }).collect(Collectors.toList());
    }

    // Mapping Entity to DTO
    @Override
    @Mapping(target = "customers", source = "customers", qualifiedByName = "customersToCustomerIds")
    VoucherRequestDTO toDTO(Voucher entity);

    // Custom method to map List<Customer> to List<Integer> (used in DTO conversion)
    @Named("customersToCustomerIds")
    default List<Integer> customersToCustomerIds(List<Customer> customers) {
        return customers.stream().map(Customer::getId).collect(Collectors.toList());
    }
}
