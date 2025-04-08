package org.example.demo.repository.order;

import org.example.demo.dto.order.core.response.CountOrderDetailInOrder;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.statistic.response.StatisticOverviewResponse;
import org.example.demo.dto.statistic.response.StatisticOverviewSymbol;
import org.example.demo.dto.statistic.response.TopProductObject;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.model.response.ICountOrderDetailInOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByCode(String code);

    @Query(value = """
            SELECT DISTINCT b FROM Order b
            LEFT JOIN FETCH b.customer bc
            LEFT JOIN FETCH b.staff bs
            LEFT JOIN FETCH b.voucher bv
            LEFT JOIN FETCH bv.customers
            WHERE
            (
                :query IS NULL OR 
                LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.customer.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.staff.name) LIKE LOWER(CONCAT('%', :query, '%'))
            )
            AND
            (:status IS NULL OR :status = '' OR LOWER(b.status) LIKE LOWER(:status))
            AND
            (:type IS NULL OR LOWER(b.type) LIKE LOWER(CONCAT('%', :type, '%')))
            AND
            (:inStore IS NULL OR b.inStore = :inStore)
            AND
            (:createdFrom IS NULL OR b.createdDate >= :createdFrom)
            AND
            (:createdTo IS NULL OR b.createdDate <= :createdTo)
            AND 
            (b.customer = :customer)
            """)
    Page<Order> findAllByPageWithQueryOfMe(
            @Param("query") String query,
            @Param("status") String status,
            @Param("type") String type,
            @Param("inStore") Boolean inStore,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            @Param("customer") Customer customer,
            Pageable pageable
    );

    @Query(value = """
            SELECT DISTINCT b FROM Order b
            LEFT JOIN FETCH b.customer bc
            LEFT JOIN FETCH b.staff bs
            LEFT JOIN FETCH b.voucher bv
            LEFT JOIN FETCH bv.customers
            WHERE
            (
                :query IS NULL OR 
                LOWER(b.code) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.customer.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(b.staff.name) LIKE LOWER(CONCAT('%', :query, '%'))
            )
            AND
            (:status IS NULL OR :status = '' OR LOWER(b.status) LIKE LOWER(:status))
            AND
            (:type IS NULL OR LOWER(b.type) LIKE LOWER(CONCAT('%', :type, '%')))
            AND
            (:inStore IS NULL OR b.inStore = :inStore)
            AND
            (:createdFrom IS NULL OR b.createdDate >= :createdFrom)
            AND
            (:createdTo IS NULL OR b.createdDate <= :createdTo)
            """)
    Page<Order> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("status") String status,
            @Param("type") String type,
            @Param("inStore") Boolean inStore,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

    @Query(value = """
            SELECT new org.example.demo.dto.order.core.response.CountStatusOrder(
            COUNT(o),
            SUM(CASE WHEN o.status = 'PENDING' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN o.status = 'TOSHIP' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN o.status = 'TORECEIVE' THEN 1 ELSE 0 END),
            SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END), 
            SUM(CASE WHEN o.status = 'CANCELED' THEN 1 ELSE 0 END)) 
            FROM Order o WHERE o.deleted = false
            AND (:createdFrom IS NULL OR o.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR o.createdDate <= :createdTo)
            AND (:type IS NULL OR LOWER(o.type) LIKE LOWER(CONCAT('%', :type, '%')))
            """
    )
    CountStatusOrder getCountStatus(
            @Param("type") String type,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo
    );

    @Query(value = "SELECT new org.example.demo.dto.order.core.response.CountStatusOrder( " +
                   "COUNT(o), " +  // Đếm tổng số đơn hàng
                   "SUM(CASE WHEN o.status = 'PENDING' THEN 1 ELSE 0 END), " +  // Đếm số đơn hàng 'PENDING'
                   "SUM(CASE WHEN o.status = 'TOSHIP' THEN 1 ELSE 0 END), " +   // Đếm số đơn hàng 'TOSHIP'
                   "SUM(CASE WHEN o.status = 'TORECEIVE' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'TORECEIVE'
                   "SUM(CASE WHEN o.status = 'DELIVERED' THEN 1 ELSE 0 END), " +// Đếm số đơn hàng 'DELIVERED'
                   "SUM(CASE WHEN o.status = 'CANCELED' THEN 1 ELSE 0 END)) " + // Đếm số đơn hàng 'CANCELED'
                   "FROM Order o WHERE o.deleted = false " +
                   "AND (o.customer = :customer)" +
                   "AND (:type IS NULL OR LOWER(o.type) LIKE LOWER(CONCAT('%', :type, '%')))"
    )
    CountStatusOrder getMyCountStatus(@Param("type") String type, @Param("customer") Customer customer);


    @Query(value = "select count(od.id) as quantity, o.code as code, o.id as id from Order o left join OrderDetail od on od.order.id = o.id where o.id in :ids group by o.id, o.code")
    List<ICountOrderDetailInOrder> getCountOrderDetailByIds(@Param("ids") List<Integer> ids);


    @Query(value = """
            SELECT ord.createdDate as createDate, ROUND(sum(ord.subTotal),0) as totalRevenue, COUNT(ord.code) as quantityOrder FROM Order ord WHERE ord.status = :status AND ord.createdDate BETWEEN :from AND :to GROUP BY ord.createdDate
            """)
    List<StatisticOverviewResponse> findAllByStatusAndCreatedDateBetweenOrderByCreatedDateDesc(Status status, LocalDateTime from, LocalDateTime to);


    @Query(value = """
                SELECT 
                    ROUND(SUM(ord.subTotal), 0) AS revenue,
                    SUM(detail.quantity) AS quantity,
                    CONCAT(DAY(ord.createdDate), '/', MONTH(ord.createdDate), '/', YEAR(ord.createdDate)) AS symbol
                FROM Order ord
                JOIN (
                    SELECT 
                        odtl.order.id AS order_id, 
                        SUM(odtl.quantity) AS quantity
                    FROM OrderDetail odtl
                    GROUP BY odtl.order.id
                ) detail ON detail.order_id = ord.id
                WHERE ord.createdDate BETWEEN :from AND :to 
                  AND ord.status = :status
                GROUP BY 
                    YEAR(ord.createdDate), 
                    MONTH(ord.createdDate), 
                    DAY(ord.createdDate)
                ORDER BY 
                    YEAR(ord.createdDate), 
                    MONTH(ord.createdDate), 
                    DAY(ord.createdDate)
            """)
    List<StatisticOverviewSymbol> findAllStatisticByDay(
            @Param("status") Status status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );


    @Query(value = """
            SELECT ROUND(sum( ord.subTotal), 0) as revenue,
            sum(coalesce(detail.quantity, 0)) as quantity,
            CONCAT(MONTH(ord.createdDate), '/', YEAR(ord.createdDate)) as symbol
            FROM Order ord
            JOIN (
                SELECT 
                    odtl.order.id AS order_id, 
                    SUM(odtl.quantity) AS quantity
                FROM OrderDetail odtl
                GROUP BY odtl.order.id
            ) detail ON detail.order_id = ord.id
            WHERE ord.createdDate BETWEEN :from AND :to AND ord.status = :status
            GROUP BY YEAR(ord.createdDate), MONTH(ord.createdDate)
            ORDER BY YEAR(ord.createdDate), MONTH(ord.createdDate)
            """)
    List<StatisticOverviewSymbol> findAllStatisticByMonth(@Param("status") Status status, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = """
            SELECT ROUND(sum( ord.subTotal), 0) as revenue,
            sum(coalesce(detail.quantity, 0)) as quantity,
            YEAR(ord.createdDate) as symbol
            FROM Order ord
            JOIN (
                SELECT 
                    odtl.order.id AS order_id, 
                    SUM(odtl.quantity) AS quantity
                FROM OrderDetail odtl
                GROUP BY odtl.order.id
            ) detail ON detail.order_id = ord.id
            WHERE ord.createdDate BETWEEN :from AND :to AND ord.status = :status
            GROUP BY YEAR(ord.createdDate)
            ORDER BY YEAR(ord.createdDate)
            """)
    List<StatisticOverviewSymbol> findAllStatisticByYear(@Param("status") Status status, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);


    @Query(value = """
            SELECT p.id as id,
            p.code as code,
            p.code as image,
            p.name as name,
            sum(od.quantity) as sold
            FROM Product p
            JOIN ProductDetail pd ON p.id = pd.product.id
            JOIN OrderDetail od ON pd.id = od.productDetail.id
            JOIN Order o on o.id = od.order.id
            WHERE o.status = 'DELIVERED'
            GROUP BY p.id, p.code, p.name
            ORDER BY SUM(od.quantity) DESC
            """)
    Page<TopProductObject> findAllTopProduct(Pageable pageable);

    int countByVoucherId(Integer voucherId);


}
