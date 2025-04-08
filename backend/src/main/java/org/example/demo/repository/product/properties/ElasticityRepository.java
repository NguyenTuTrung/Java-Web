package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Elasticity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ElasticityRepository extends JpaRepository<Elasticity, Integer> {
    boolean existsByCodeAndName(String code, String name);
    @Query(value = """
            SELECT DISTINCT e FROM Elasticity e
            WHERE
            (:query IS NULL OR (LOWER(e.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR e.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR e.createdDate <= :createdTo)
            GROUP BY e
            ORDER BY e.createdDate DESC
            
            """)
    Page<Elasticity> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );


    @Query(value = """
            SELECT DISTINCT el FROM Elasticity el
            WHERE el.deleted = false
            ORDER BY el.createdDate DESC
            """)
    List<Elasticity> findAllList();

    @Query(value = """
            SELECT DISTINCT e FROM Elasticity e
            ORDER BY e.createdDate DESC
            """)
    List<Elasticity> findAllObject();
}
