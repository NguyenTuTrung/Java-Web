package org.example.demo.repository.product.properties;

import org.example.demo.entity.product.properties.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    boolean existsByCodeAndUrl(String code, String url); // Sửa ở đây

    @Query(value = """
            SELECT DISTINCT i FROM Image i
            WHERE
            (:query IS NULL OR (LOWER(i.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(i.url) LIKE LOWER(CONCAT('%', :query, '%'))))
            AND (:createdFrom IS NULL OR i.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR i.createdDate <= :createdTo)
            GROUP BY i
            """)
    Page<Image> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

    Optional<Image> findByCode(String code);
}
