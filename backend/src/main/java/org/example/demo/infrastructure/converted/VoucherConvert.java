package org.example.demo.infrastructure.converted;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.entity.voucher.enums.Type;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class VoucherConvert {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Voucher convertRequestToEntity(VoucherRequest request) {
        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .quantity(request.getQuantity())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .typeTicket(request.getTypeTicket())
                .deleted(false)
                .maxPercent(request.getMaxPercent())
                .minAmount(request.getMinAmount())
                .build();
    }

    public Voucher convertRequestToEntity(Integer id, VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher with ID " + id + " not found"));
        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setStatus(request.getStatus());
        voucher.setQuantity(request.getQuantity());
        voucher.setMinAmount(request.getMinAmount());
        voucher.setMaxPercent(request.getMaxPercent());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setTypeTicket(request.getTypeTicket());
        voucher.setDeleted(request.getDeleted());
        if (request.getCustomers() != null && !request.getCustomers().isEmpty() && request.getTypeTicket() == Type.Individual) {
            List<Customer> customers = customerRepository.findAllById(request.getCustomers());
            if (customers.size() != request.getCustomers().size()) {
                throw new RuntimeException("One or more customers not found");
            }
            voucher.setCustomers(customers);
        } else {
            voucher.setCustomers(new ArrayList<>());
        }

        return voucher;
    }

}
