package org.example.demo.repository.product.properties;

import org.example.demo.dto.product.response.properties.ProductWithQuantityDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.entity.product.properties.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByCodeAndName(String code, String name);

    Optional<Product> findByName(String name);


    @Query(value = """
            SELECT DISTINCT p FROM Product p
            LEFT JOIN ProductDetail pd ON pd.product.id = p.id
            WHERE
            (:query IS NULL OR (LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom)
            AND (:createdTo IS NULL OR p.createdDate <= :createdTo)
            GROUP BY p
            ORDER BY p.createdDate DESC
            
            """)
    Page<Product> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );

//    @Query(value = """
//        SELECT p.id as id, p.code as code, p.name as name, p.deleted as deleted,
//               COALESCE(SUM(CASE
//                           WHEN pd.deleted = FALSE
//                                AND (pd.brand.deleted = FALSE OR pd.brand.deleted IS NULL)
//                                AND (pd.size.deleted = FALSE OR pd.size.deleted IS NULL)
//                                AND (pd.color.deleted = FALSE OR pd.color.deleted IS NULL)
//                                AND (pd.texture.deleted = FALSE OR pd.texture.deleted IS NULL)
//                                AND (pd.origin.deleted = FALSE OR pd.origin.deleted IS NULL)
//                                AND (pd.collar.deleted = FALSE OR pd.collar.deleted IS NULL)
//                                AND (pd.sleeve.deleted = FALSE OR pd.sleeve.deleted IS NULL)
//                                AND (pd.style.deleted = FALSE OR pd.style.deleted IS NULL)
//                                AND (pd.material.deleted = FALSE OR pd.material.deleted IS NULL)
//                                AND (pd.thickness.deleted = FALSE OR pd.thickness.deleted IS NULL)
//                                AND (pd.elasticity.deleted = FALSE OR pd.elasticity.deleted IS NULL)
//                           THEN pd.quantity
//                           ELSE 0
//                       END), 0) as quantity,
//               p.createdDate as createdDate, p.updatedDate as modifiedDate
//        FROM Product p
//        LEFT JOIN ProductDetail pd ON p.id = pd.product.id
//        LEFT JOIN pd.brand b
//        LEFT JOIN pd.size s
//        LEFT JOIN pd.color c
//        LEFT JOIN pd.texture t
//        LEFT JOIN pd.origin o
//        LEFT JOIN pd.collar col
//        LEFT JOIN pd.sleeve sl
//        LEFT JOIN pd.style st
//        LEFT JOIN pd.material m
//        LEFT JOIN pd.thickness th
//        LEFT JOIN pd.elasticity e
//        LEFT JOIN pd.images img
//        WHERE
//           (:query IS NULL OR (LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))
//           OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))))
//           AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom)
//           AND (:createdTo IS NULL OR p.createdDate <= :createdTo)
//        GROUP BY p.id, p.code, p.name, p.deleted, p.createdDate, p.updatedDate
//        ORDER BY p.createdDate DESC
//        """)

    @Query(value = """
            SELECT p.id as id, p.code as code, p.name as name, p.deleted as deleted,
            COALESCE(SUM(pd.quantity), 0) as quantity,
            p.createdDate as createdDate, p.updatedDate as modifiedDate
            FROM Product p
            LEFT JOIN ProductDetail pd ON p.id = pd.product.id
            left JOIN Size s on s.id = pd.size.id
            left JOIN Color c on c.id = pd.color.id
            left JOIN Brand b on b.id = pd.brand.id
            left JOIN Texture t on t.id = pd.texture.id
            left JOIN Origin o on o.id = pd.origin.id
            left JOIN Sleeve sl on sl.id = pd.sleeve.id
            left JOIN Style st on st.id = pd.style.id
            left JOIN Material m on m.id = pd.material.id
            left JOIN Thickness th on th.id = pd.thickness.id
            left JOIN Elasticity e on e.id = pd.elasticity.id
            left JOIN Collar col on c.id = pd.collar.id
            WHERE
               (:query IS NULL OR (LOWER(p.code) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
               )
               AND (:createdFrom IS NULL OR p.createdDate >= :createdFrom)
               AND (:createdTo IS NULL OR p.createdDate <= :createdTo)
            GROUP BY p.id, p.code, p.name, p.deleted, p.createdDate, p.updatedDate
             ORDER BY p.createdDate DESC
            """)


    Page<ProductWithQuantityResponseDTO> findAllByPageWithQueryV2(
            @Param("query") String query,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            Pageable pageable
    );


    @Query(value = """
            SELECT DISTINCT p FROM Product p
            WHERE p.deleted = false
            ORDER BY p.createdDate DESC
            """)
    List<Product> findAllList();

    @Query(value = """
            SELECT DISTINCT e FROM Product e
            ORDER BY e.createdDate DESC
            """)
    List<Product> findAllObject();

}













