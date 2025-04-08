package org.example.demo.repository.customer;

import org.example.demo.entity.human.customer.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    // Tìm tất cả địa chỉ của khách hàng dựa trên customerId
    List<Address> findByCustomerId(Integer customerId);

    // check trùng sdt
    List<Address> findAddressByPhone(String phone);

    @Query("SELECT address FROM Address  address ORDER BY address.createdDate DESC ")
    Page<Address> findAllAddresses(Pageable pageable);

    @Query("SELECT a FROM Address a WHERE a.customer.id = :customerId ORDER BY a.createdDate DESC")
    Page<Address> findAddressesByCustomerId(@Param("customerId") int customerId, Pageable pageable);
    Page<Address> findAddressesByCustomerEmail(@Param("email") String email, Pageable pageable);

}
