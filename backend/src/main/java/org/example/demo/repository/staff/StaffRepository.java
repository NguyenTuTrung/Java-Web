package org.example.demo.repository.staff;

import org.example.demo.entity.human.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findById(Integer id);

    @Query("SELECT emp FROM Staff emp WHERE " +
            "(:keyword IS NULL OR " +
            "emp.name LIKE %:keyword% OR " +
            "emp.phone LIKE %:keyword% OR " +
            "emp.code LIKE %:keyword% OR " +
            "emp.email LIKE %:keyword% OR " +
            "emp.status LIKE %:keyword% OR " +
            "emp.citizenId LIKE %:keyword%) AND " +
            "(:fullName IS NULL OR emp.name LIKE %:fullName%) AND " +
            "(:phone IS NULL OR emp.phone LIKE %:phone%) AND " +
            "(:code IS NULL OR emp.code LIKE %:code%) AND " +
            "(:email IS NULL OR emp.email LIKE %:email%) AND " +
            "(:status IS NULL OR emp.status = :status) AND " +
            "(:citizenId IS NULL OR emp.citizenId LIKE %:citizenId%) " +
            "ORDER BY emp.createdDate DESC")
        // Sort by the most recently created
    Page<Staff> searchNhanVien(@Param("keyword") String keyword,
                               @Param("fullName") String fullName,
                               @Param("phone") String phone,
                               @Param("code") String code,
                               @Param("email") String email,
                               @Param("status") String status,
                               @Param("citizenId") String citizenId,
                               Pageable pageable);

    List<Staff> findStaffByEmail(String email);

    List<Staff> findStaffByPhone(String phone);

    List<Staff> findStaffByCitizenId(String citizenId);




    Optional<Staff> findByEmail(String email);

    boolean existsByEmail(String email);
}
