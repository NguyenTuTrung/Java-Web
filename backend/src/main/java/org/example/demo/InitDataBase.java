package org.example.demo;

import com.beust.ah.A;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import org.example.demo.dto.auth.request.AccountRequestDTO;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.security.Account;
import org.example.demo.exception.DataNotFoundException;
import org.example.demo.exception.PermissionDenyException;
import org.example.demo.repository.customer.AddressRepository;
import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.repository.security.RoleRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.service.auth.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Component
public class InitDataBase {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    @PostConstruct
    public void init() throws DataNotFoundException, PermissionDenyException {
        // ROLE
        if(roleRepository.findByCode("ROLE_ADMIN").isEmpty()){
            Role role = new Role();
            role.setCode("ROLE_ADMIN");
            role.setName("ROLE_ADMIN");
            roleRepository.save(role);
        }
        if(roleRepository.findByCode("ROLE_STAFF").isEmpty()){
            Role role = new Role();
            role.setCode("ROLE_STAFF");
            role.setName("ROLE_STAFF");
            roleRepository.save(role);
        }
        if(roleRepository.findByCode("ROLE_USER").isEmpty()){
            Role role = new Role();
            role.setCode("ROLE_USER");
            role.setName("ROLE_USER");
            roleRepository.save(role);
        }
        if (accountRepository.findByUsername("admin@gmail.com").isEmpty()){
            AccountRequestDTO account = new AccountRequestDTO();
            account.setUsername("admin@gmail.com");
            account.setPassword("123456");
            account.setEnabled(true);
            account.setRoleId(roleRepository.findByCode("ROLE_ADMIN").get().getId());
            accountService.createAccount(account);
        }
    }
}