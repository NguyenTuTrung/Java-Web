package org.example.demo.repository.voucher;


import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    Optional<Voucher> findByCode(String code);

    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER(ORDER BY v.created_date DESC) AS indexs,
                v.id AS id,
                v.code AS code,
                v.name AS name, 
                v.type_ticket AS typeTicket,
                v.quantity AS quantity,
                v.start_date AS startDate,
                v.end_date AS endDate,
                v.max_percent AS maxPercent,
                v.min_amount AS minAmount,
                v.status AS status
            FROM voucher v
            """, nativeQuery = true)
    List<VoucherResponse> getPublicVoucher();

    @Query(value = """
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY v.created_date DESC) AS indexs,
                    v.id AS id,
                    v.code AS code,
                    v.name AS name, 
                    v.type_ticket AS typeTicket,
                    v.quantity AS quantity,
                    v.start_date AS startDate,
                    v.end_date AS endDate,
                    v.max_percent AS maxPercent,
                    v.min_amount AS minAmount,
                    v.status AS status,
                    c.id AS customerId,
                    c.name AS customerName,
                    c.email AS customerEmail
                FROM voucher v
                LEFT JOIN voucher_customer vc ON v.id = vc.voucher_id
                LEFT JOIN customer c ON vc.customer_id = c.id
                WHERE (:idCustomer IS NULL OR c.id = :idCustomer)
                AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
                AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
                ORDER BY v.id DESC
            """, nativeQuery = true)
    List<VoucherResponse> getAllVouchersWithCustomers(@Param("idCustomer") Integer id, @Param("req") VoucherRequest request);


    @Query(value = """
            SELECT 
                ROW_NUMBER() OVER(ORDER BY v.created_date DESC) AS indexs,
                v.id AS id,
                v.code AS code,
                v.name AS name, 
                v.type_ticket AS typeTicket,
                v.quantity AS quantity,
                v.start_date AS startDate,
                v.end_date AS endDate,
                v.max_percent AS maxPercent,
                v.min_amount AS minAmount,
                v.status AS status
            FROM voucher v
            WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' 
                   OR v.name LIKE '%' + :#{#req.name} + '%' 
                   OR v.code LIKE '%' + :#{#req.name} + '%')
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            """,
            countQuery = """
                    SELECT COUNT(*) 
                    FROM voucher v
                    WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' 
                           OR v.name LIKE '%' + :#{#req.name} + '%' 
                           OR v.code LIKE '%' + :#{#req.name} + '%')
                    AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
                    """,
            nativeQuery = true)
    Page<VoucherResponse> getAllVoucher(@Param("req") VoucherRequest request, Pageable pageable);

    @Query("""
                SELECT v FROM Voucher v
                WHERE
                      (:keyword IS NULL OR 
                       v.name LIKE %:keyword% OR 
                       v.code LIKE %:keyword%) 
                  AND (:name IS NULL OR v.name LIKE %:name%) 
                  AND (:code IS NULL OR v.code LIKE %:code%) 
                  AND (:typeTicket IS NULL OR CAST(v.typeTicket as string) = :typeTicket) 
                  AND (:quantity IS NULL OR v.quantity = :quantity) 
                  AND (:maxPercent IS NULL OR v.maxPercent = :maxPercent) 
                  AND (:minAmount IS NULL OR v.minAmount = :minAmount) 
                  AND (:status IS NULL OR v.status = :status)
            """)
    Page<Voucher> searchVoucher(@Param("keyword") String keyword,
                                @Param("name") String name,
                                @Param("code") String code,
                                @Param("typeTicket") String typeTicket,
                                @Param("quantity") Integer quantity,
                                @Param("maxPercent") Double maxPercent,
                                @Param("minAmount") Double minAmount,
                                @Param("status") String status,
                                Pageable pageable);

    @Query("""
            SELECT v FROM Voucher v
            WHERE CAST(v.minAmount AS bigdecimal) > :amount
            AND v.quantity > 0
            AND v.deleted = FALSE
            AND v.status = 'Active'
            ORDER BY v.maxPercent ASC
            """)
    List<Voucher> findVoucherWithMinAmountGreaterThan(@Param("amount") BigDecimal amount);

    @Query("""
            SELECT v FROM Voucher v
            WHERE CAST(v.minAmount AS bigdecimal) < :amount
            AND v.quantity > 0
            AND v.deleted = FALSE
            AND v.status = 'Active'
            ORDER BY v.maxPercent DESC
            """)
    List<Voucher> findBestVoucher(@Param("amount") BigDecimal amount);

    @Query("""
            SELECT v FROM Voucher v
            WHERE CAST(v.minAmount AS bigdecimal) < :amount
            AND v.quantity > 0
            AND v.deleted = FALSE
            AND v.status = 'Active'
            ORDER BY v.maxPercent asc
            """)
    List<Voucher> findListAbleToUseVoucher(@Param("amount") BigDecimal amount);

    @Query("""
            SELECT v FROM Voucher v
            WHERE v.quantity > 0
            AND v.deleted = FALSE
            AND v.status = 'Active'
            """)
    List<Voucher> findTopVouchers(Sort sort);


    @Query("""
            SELECT v FROM Voucher v
            WHERE v.quantity > 0
            AND v.deleted = FALSE
            AND v.status = 'Active'
            """)
    List<Voucher> findSortAmountVouchers(Sort sort);

    @Query(
            value = """
            SELECT v FROM Voucher v
            LEFT JOIN FETCH v.customers c
            WHERE v.quantity > 0
            AND v.deleted = false
            AND (
                 :query IS NULL OR
                 LOWER(v.code) LIKE LOWER(CONCAT('%', :query, '%')) OR
                 LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%'))
            )
            AND (:typeTicket IS NULL OR LOWER(v.typeTicket) LIKE LOWER(CONCAT('%', :typeTicket, '%')))
            AND (
                :idCustomer IS NULL AND LOWER(v.typeTicket) like 'everybody' OR
                :idCustomer IS NOT NULL AND ((LOWER(v.typeTicket) like 'individual' AND c.id = :idCustomer) OR LOWER(v.typeTicket) like 'everybody')
            )
           AND v.startDate < CURRENT_TIMESTAMP
           AND v.endDate >= CURRENT_TIMESTAMP
            """
    )
    Page<Voucher> selectPageActiveAndAbleToUseVoucher(
            String query,
            String typeTicket,
            Integer idCustomer,
            Pageable pageable
    );

}
