package org.example.demo.config.security;

import org.example.demo.repository.customer.CustomerRepository;
import org.example.demo.repository.security.AccountRepository;
import org.example.demo.repository.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return accountRepository.findByUsername(email)
                .map(customer -> (UserDetails) customer)
                .orElseGet(() ->
                        accountRepository.findByUsername(email)
                                .map(staff -> (UserDetails) staff)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email))
                );
    }
}
