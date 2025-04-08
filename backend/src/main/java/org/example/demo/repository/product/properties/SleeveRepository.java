package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Sleeve;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SleeveRepository extends JpaRepository<Sleeve, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT s FROM Sleeve s
            WHERE
            (:query IS NULL OR (LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR s.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR s.createdDate <= :createdTo)
            GROUP BY s
            ORDER BY s.createdDate DESC
            
            """)
    Page<Sleeve> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

    @Query(value = """
            SELECT DISTINCT s FROM Sleeve s
            WHERE s.deleted = false
            ORDER BY s.createdDate DESC
            """)
    List<Sleeve> findAllList();

    @Query(value = """
            SELECT DISTINCT e FROM Sleeve e
            ORDER BY e.createdDate DESC
            """)
    List<Sleeve> findAllObject();
}
