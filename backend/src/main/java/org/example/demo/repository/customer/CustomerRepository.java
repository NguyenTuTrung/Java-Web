package org.example.demo.repository.customer;

import org.example.demo.entity.human.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query(value = """
            select * from customer
            """, nativeQuery = true)
    List<Customer> getAllCustomer();

    @Query("""
           SELECT c FROM Customer c WHERE 
           (LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR 
           LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR 
           LOWER(c.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR 
           LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND 
           c.deleted = false AND lower(c.status) like 'active'
           """)
    Page<Customer>searchActive(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Tim kiem theo name, email, phone
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> search(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Loc theo status
    @Query("SELECT c FROM Customer c WHERE c.status = :status")
    Page<Customer> findByStatus(@Param("status") String status, Pageable pageable);

    @Query("SELECT c FROM Customer c ORDER BY c.createdDate DESC")
    Page<Customer> findAllCustomers(Pageable pageable);

    List<Customer> findCustomerByEmail(String email);

    List<Customer> findCustomerByPhone(String phone);

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);
}

