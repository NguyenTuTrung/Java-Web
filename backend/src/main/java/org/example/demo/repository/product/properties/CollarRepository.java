package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CollarRepository extends JpaRepository<Collar, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT c FROM Collar c
            WHERE
            (:query IS NULL OR (LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR c.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR c.createdDate <= :createdTo)
            GROUP BY c
            ORDER BY c.createdDate DESC
            """)
    Page<Collar> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );


    @Query(value = """
            SELECT DISTINCT cr FROM Collar cr
            WHERE cr.deleted = false
            ORDER BY cr.createdDate DESC
            """)
    List<Collar> findAllList();

    @Query(value = """
            SELECT DISTINCT e FROM Collar e
            ORDER BY e.createdDate DESC
            """)
    List<Collar> findAllObject();
}
