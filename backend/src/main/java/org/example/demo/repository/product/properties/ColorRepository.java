package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Color;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ColorRepository extends JpaRepository<Color, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT c FROM Color c
            WHERE
            (:query IS NULL OR (LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR c.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR c.createdDate <= :createdTo)
            GROUP BY c
            ORDER BY c.createdDate DESC

            """)
    Page<Color> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );


    @Query(value = """
            SELECT DISTINCT c FROM Color c
            WHERE c.deleted = false
            ORDER BY c.createdDate DESC
            """)
    List<Color> findAllList();

    @Query(value = """
            SELECT DISTINCT e FROM Color e
            ORDER BY e.createdDate DESC
            """)
    List<Color> findAllObject();
}
