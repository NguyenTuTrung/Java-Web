package org.example.demo.repository.product.core;

import org.example.demo.dto.product.phah04.request.FindProductDetailRequest;
import org.example.demo.dto.product.phah04.response.ProductClientResponse;
import org.example.demo.dto.product.response.properties.ProductDiscountDTO;
import org.example.demo.dto.product.response.properties.ProductResponseOverDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {

    @Query("SELECT p FROM ProductDetail p WHERE  p.size = ?1 AND p.color = ?2 AND p.texture = ?3 " +
            "AND p.origin = ?4 AND p.brand = ?5 AND p.collar = ?6 AND p.sleeve = ?7 " +
            "AND p.style = ?8 AND p.material = ?9 AND p.thickness = ?10 AND p.elasticity = ?11  AND p.product = ?12")
    ProductDetail findByAttributes( Size size, Color color, Texture texture,
                                   Origin origin, Brand brand, Collar collar, Sleeve sleeve,
                                    Style style, Material material, Thickness thickness, Elasticity elasticity, Product product);

    @Query("SELECT p FROM ProductDetail p WHERE p.product.name = ?1 AND p.size = ?2 AND p.color = ?3")
    ProductDetail findByName(String name, Size size, Color color);

    List<ProductDetail> findByProductId(Integer productId);

    @Query("""
            SELECT pd FROM ProductDetail pd
            WHERE pd.deleted = false
            AND pd.product.deleted = false
            AND pd.product.id = :id
            """)
    List<ProductDetail> findAllByProductId(Integer id);

    @Query(value = """
            SELECT DISTINCT pd FROM ProductDetail pd
            LEFT JOIN FETCH pd.product 
            LEFT JOIN FETCH pd.size s
            LEFT JOIN FETCH pd.color c
            LEFT JOIN FETCH pd.texture t
            LEFT JOIN FETCH pd.origin o
            LEFT JOIN FETCH pd.brand b
            LEFT JOIN FETCH pd.collar cr
            LEFT JOIN FETCH pd.sleeve sl
            LEFT JOIN FETCH pd.style st
            LEFT JOIN FETCH pd.material m
            LEFT JOIN FETCH pd.thickness ts
            LEFT JOIN FETCH pd.elasticity ey
            LEFT JOIN FETCH pd.images 
            
         
            WHERE 
            (:productId IS NULL OR pd.product.id = :productId)
            AND 
            (
                (:query IS NULL OR LOWER(pd.code) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.brand.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.collar.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.color.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.elasticity.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.origin.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.size.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.style.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.sleeve.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.thickness.name) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(pd.texture.name) LIKE LOWER(CONCAT('%', :query, '%')))
                
                OR (:query IS NULL OR LOWER(CAST(pd.quantity AS string)) LIKE LOWER(CONCAT('%', :query, '%')))
                OR (:query IS NULL OR LOWER(CAST(pd.price AS string)) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:size IS NULL OR pd.size.name  LIKE LOWER(CONCAT('%', :size, '%')))
            AND (:color IS NULL OR pd.color.name  LIKE LOWER(CONCAT('%', :color, '%')))
            AND (:style IS NULL OR pd.style.name  LIKE LOWER(CONCAT('%', :style, '%')))
            AND (:texture IS NULL OR pd.texture.name  LIKE LOWER(CONCAT('%', :texture, '%')))
            AND (:origin IS NULL OR pd.origin.name  LIKE LOWER(CONCAT('%', :origin, '%')))
            AND (:brand IS NULL OR pd.brand.name  LIKE LOWER(CONCAT('%', :brand, '%')))
            AND (:collar IS NULL OR pd.collar.name  LIKE LOWER(CONCAT('%', :collar, '%')))
            AND (:sleeve IS NULL OR pd.sleeve.name  LIKE LOWER(CONCAT('%', :sleeve, '%')))
            AND (:material IS NULL OR pd.material.name  LIKE LOWER(CONCAT('%', :material, '%')))
            AND (:thickness IS NULL OR pd.thickness.name  LIKE LOWER(CONCAT('%', :thickness, '%')))
            AND (:elasticity IS NULL OR pd.elasticity.name LIKE LOWER(CONCAT('%', :elasticity, '%')))
            ORDER BY pd.createdDate DESC
            """)
    Page<ProductDetail> findAllByProductIdWithQuery(
            @Param("productId") Integer productId,
            @Param("query") String query,
            @Param("size") String size,
            @Param("color") String color,
            @Param("style") String style,
            @Param("texture") String texture,
            @Param("origin") String origin,
            @Param("brand") String brand,
            @Param("collar") String collar,
            @Param("sleeve") String sleeve,
            @Param("material") String material,
            @Param("thickness") String thickness,
            @Param("elasticity") String elasticity,
            Pageable pageable
    );



    @Query(value = """
            SELECT DISTINCT pd FROM ProductDetail pd
            LEFT JOIN FETCH pd.product 
            LEFT JOIN FETCH pd.size s
            LEFT JOIN FETCH pd.color c
            LEFT JOIN FETCH pd.texture t
            LEFT JOIN FETCH pd.origin o
            LEFT JOIN FETCH pd.brand b
            LEFT JOIN FETCH pd.collar cr
            LEFT JOIN FETCH pd.sleeve sl
            LEFT JOIN FETCH pd.style st
            LEFT JOIN FETCH pd.material m
            LEFT JOIN FETCH pd.thickness ts
            LEFT JOIN FETCH pd.elasticity ey
            WHERE 
            (:productId IS NULL OR pd.product.id = :productId)
            ORDER BY pd.createdDate DESC
            """)
    List<ProductDetail> findAllByProductIdv2(
            @Param("productId") Integer productId

    );




    @Query(value = """
     SELECT pd FROM ProductDetail pd
     LEFT JOIN FETCH pd.product
     LEFT JOIN FETCH pd.size
     LEFT JOIN FETCH pd.color
     LEFT JOIN FETCH pd.texture
     LEFT JOIN FETCH pd.origin
     LEFT JOIN FETCH pd.brand
     LEFT JOIN FETCH pd.collar
     LEFT JOIN FETCH pd.sleeve
     LEFT JOIN FETCH pd.style
     LEFT JOIN FETCH pd.material
     LEFT JOIN FETCH pd.thickness
     LEFT JOIN FETCH pd.elasticity
     LEFT JOIN FETCH pd.images
     WHERE pd.id = :id
     """)
    Optional<ProductDetail> findIdWithQuery(@Param("id") Integer id);





    // BY PHAH04
    @Query(value = """
            SELECT DISTINCT pd FROM ProductDetail pd
            LEFT JOIN FETCH pd.size pdse
            LEFT JOIN FETCH pd.color pdcr
            LEFT JOIN FETCH pd.product pdpt
            LEFT JOIN FETCH pd.texture pdt
            LEFT JOIN FETCH pd.origin pdo
            LEFT JOIN FETCH pd.brand pdbr
            LEFT JOIN FETCH pd.collar pdc
            LEFT JOIN FETCH pd.sleeve pds
            LEFT JOIN FETCH pd.material pdm
            LEFT JOIN FETCH pd.thickness pdth
            LEFT JOIN FETCH pd.elasticity pde
            WHERE
            (
                (:query IS NULL OR LOWER(pd.code) LIKE LOWER(CONCAT('%', :query, '%'))) OR
                (:query IS NULL OR LOWER(pd.product.name) LIKE LOWER(CONCAT('%', :query, '%')))
            )
            AND (:size IS NULL OR pd.size.id = :size)
            AND (:color IS NULL OR pd.color.id = :color)
            AND (:product IS NULL OR pd.product.id = :product)
            AND (:texture IS NULL OR pd.texture.id = :texture)
            AND (:origin IS NULL OR pd.origin.id = :origin)
            AND (:brand IS NULL OR pd.brand.id = :brand)
            AND (:collar IS NULL OR pd.collar.id = :collar)
            AND (:sleeve IS NULL OR pd.sleeve.id = :sleeve)
            AND (:material IS NULL OR pd.material.id = :material)
            AND (:thickness IS NULL OR pd.thickness.id = :thickness)
            AND (:elasticity IS NULL OR pd.elasticity.id = :elasticity)
            AND pdpt.deleted = FALSE
            AND pd.deleted = FALSE
            """)
    Page<ProductDetail> findAllByPageWithQuery(
            @Param("query") String query,
            @Param("size") Integer size,
            @Param("color") Integer color,
            @Param("product") Integer product,
            @Param("texture") Integer texture,
            @Param("origin") Integer origin,
            @Param("brand") Integer brand,
            @Param("collar") Integer collar,
            @Param("sleeve") Integer sleeve,
            @Param("material") Integer material,
            @Param("thickness") Integer thickness,
            @Param("elasticity") Integer elasticity,
            Pageable pageable
    );


    @Query(value = """
        SELECT
            pd.id AS id,
            ROW_NUMBER() OVER(ORDER BY pd.updated_at DESC) AS indexs,
            (pd.name + ' [' + pdcr.name + ' - ' + pdse.name + ']') AS name,
            pd.code AS code,
            pdso.name AS sole,
            pdcr.name AS color,
            pdse.name AS size,
            pd.quantity AS quantity,
            pd.weight AS weight,
            pd.price AS price,
            STRING_AGG(img.name, ',') AS images,
            pd.deleted AS status
        FROM
            product_detail pd
            LEFT JOIN product pdp ON pd.product_id = pdp.id
            LEFT JOIN color pdcr ON pd.color_id = pdcr.id
            LEFT JOIN size pdse ON pd.size_id = pdse.id
            LEFT JOIN images img ON img.product_detail_id = pd.id
        WHERE
            (:#{#req.product} IS NULL OR pd.product_id IN (:#{#req.products}))
            AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR pd.color_id IN (:#{#req.colors}))
            AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR pd.size_id IN (:#{#req.sizes}))
            AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR (pdp.name + ' ' + pdcr.name + ' ' + pdse.name + ' ') LIKE '%' + :#{#req.name} + '%')
        GROUP BY
            pd.id, pd.updated_at, pd.name, pdcr.name, pdse.name, pd.code, pdso.name, pd.quantity, pd.weight, pd.price, pd.deleted;
        """, nativeQuery = true)
    Page<ProductClientResponse> productClient(@Param("req")FindProductDetailRequest request, Pageable pageable);






    @Query("""
                SELECT new org.example.demo.dto.product.response.properties.ProductResponseOverDTO(
                    p.id,
                    p.code,
                    p.name,
                    COUNT(DISTINCT c.id),
                    COUNT(DISTINCT s.id),
                    MIN(pd.price)
                )
                FROM Product p
                JOIN ProductDetail pd ON p.id = pd.product.id
                JOIN Color c ON c.id = pd.color.id
                JOIN Size s ON s.id = pd.size.id
                JOIN Brand b ON b.id = pd.brand.id
                WHERE (:sizeCodes IS NULL OR s.code IN :sizeCodes)
                AND (:colorCodes IS NULL OR c.code IN :colorCodes)
                AND (:brandCodes IS NULL OR b.code IN :brandCodes)
                AND (:minPrice IS NULL OR pd.price >= :minPrice)
                AND (:maxPrice IS NULL OR pd.price <= :maxPrice)
                AND p.deleted = FALSE
                AND pd.deleted = FALSE
                AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
                GROUP BY p.id, p.code, p.name, p.createdDate
                ORDER BY p.createdDate DESC
            """)
    Page<ProductResponseOverDTO> findCustomPage(
            Pageable pageable,
            @Param("sizeCodes") List<String> sizeCodes,
            @Param("colorCodes") List<String> colorCodes,
            @Param("brandCodes") List<String> brandCodes,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("query") String query
    );

    @Query(
            value = """
                select distinct new org.example.demo.dto.product.response.properties.ProductResponseOverDTO(
                p.id,
                p.code,
                p.name,
                count(DISTINCT c.id),
                count(DISTINCT s.id),
                MIN(pd.price)
                )
                FROM Product p
                JOIN ProductDetail pd on p.id = pd.product.id
                JOIN Color c on c.id = pd.color.id
                JOIN Size s on s.id = pd.size.id
                WHERE p.id = :productId
                AND p.deleted = FALSE
                AND c.deleted = FALSE
                AND s.deleted = FALSE
                AND pd.deleted = FALSE
                GROUP BY p.id, p.code, p.name
                """
    )
    List<ProductResponseOverDTO> findCustomListByProductId(Integer productId);

    @Query(
            value = """
                    select new org.example.demo.dto.product.response.properties.ProductResponseOverDTO(
                    p.id,
                    p.code,
                    p.name,
                    count(DISTINCT c.id),
                    count(DISTINCT s.id),
                    MIN(pd.price)
                    ) FROM Product p
                    LEFT JOIN ProductDetail pd on p.id = pd.product.id
                    JOIN Color c on c.id = pd.color.id
                    JOIN Size s on s.id = pd.size.id
                    WHERE p.id = :id
                    AND p.deleted = false
                    AND s.deleted = false
                    AND c.deleted = false
                    group by p.id, p.code, p.name
                    """
    )
    Optional<ProductResponseOverDTO> findOneCustom(@Param("id") Integer id);

    @EntityGraph(attributePaths = {"brand", "color", "size", "material", "images"})
    @Query(value = """
            SELECT pd from ProductDetail pd  where pd.product.id in :ids and pd.deleted = false
            """)
    List<ProductDetail> findAllByProductIdCustom(List<Integer> ids);

    Optional<ProductDetail> findByCode(String code);


//    @Query("SELECT pd FROM ProductDetail pd WHERE pd.createdDate >= :oneWeekAgo")
//    List<ProductDetail> findNewProductsInLastWeek(@Param("oneWeekAgo") LocalDateTime oneWeekAgo);


    @Query("""
                SELECT new org.example.demo.dto.product.response.properties.ProductResponseOverDTO(
                    p.id,
                    p.code,
                    p.name,
                    COUNT(DISTINCT c.id),
                    COUNT(DISTINCT s.id),
                    MIN(pd.price)
                )
                FROM Product p
                JOIN ProductDetail pd ON p.id = pd.product.id
                JOIN Color c ON c.id = pd.color.id
                JOIN Size s ON s.id = pd.size.id
                JOIN Brand b ON b.id = pd.brand.id
                WHERE (:sizeCodes IS NULL OR s.code IN :sizeCodes)
                AND (:colorCodes IS NULL OR c.code IN :colorCodes)
                AND (:brandCodes IS NULL OR b.code IN :brandCodes)
                AND (:minPrice IS NULL OR pd.price >= :minPrice)
                AND (:maxPrice IS NULL OR pd.price <= :maxPrice)
                AND (:createdDate IS NULL OR pd.createdDate >= :createdDate)
                AND p.deleted = FALSE
                AND c.deleted = FALSE
                AND s.deleted = FALSE
                AND b.deleted = FALSE
                AND pd.deleted = FALSE
                GROUP BY p.id, p.code, p.name
            """)
    Page<ProductResponseOverDTO> findCustomPage2(
            Pageable pageable,
            @Param("sizeCodes") List<String> sizeCodes,
            @Param("colorCodes") List<String> colorCodes,
            @Param("brandCodes") List<String> brandCodes,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("createdDate") LocalDateTime createdDate
    );

    @Query("""
                SELECT new org.example.demo.dto.product.response.properties.ProductDiscountDTO(
                    p.id,
                    p.code,
                    p.name,
                    COUNT(DISTINCT c.id),
                    COUNT(DISTINCT s.id),
                    MIN(pd.price)
                )
                FROM Product p
                JOIN ProductDetail pd ON p.id = pd.product.id
                JOIN Color c ON c.id = pd.color.id
                JOIN Size s ON s.id = pd.size.id
                JOIN Brand b ON b.id = pd.brand.id
                JOIN p.events e
                WHERE (:sizeCodes IS NULL OR s.code IN :sizeCodes)
                AND (:colorCodes IS NULL OR c.code IN :colorCodes)
                AND (:brandCodes IS NULL OR b.code IN :brandCodes)
                AND (:minPrice IS NULL OR pd.price >= :minPrice)
                AND (:maxPrice IS NULL OR pd.price <= :maxPrice)
                AND (:eventDiscountPercent IS NULL OR e.discountPercent >= :eventDiscountPercent)
                AND (:eventQuantityDiscount IS NULL OR e.quantityDiscount >= :eventQuantityDiscount)
                AND e.startDate <= CURRENT_TIMESTAMP
                AND e.endDate >= CURRENT_TIMESTAMP
                AND p.deleted = FALSE
                AND pd.deleted = FALSE
                GROUP BY p.id, p.code, p.name
            """)
    Page<ProductDiscountDTO> findCustomeByEvent(
            Pageable pageable,
            @Param("sizeCodes") List<String> sizeCodes,
            @Param("colorCodes") List<String> colorCodes,
            @Param("brandCodes") List<String> brandCodes,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("eventDiscountPercent") Long eventDiscountPercent,  // Lọc theo discountPercent của sự kiện
            @Param("eventQuantityDiscount") Long eventQuantityDiscount   // Lọc theo quantityDiscount của sự kiện
    );


}