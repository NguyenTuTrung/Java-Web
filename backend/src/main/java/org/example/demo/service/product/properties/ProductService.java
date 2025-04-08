package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.product.mchien.ProductDTO;
import org.example.demo.dto.product.requests.properties.ProductRequestDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.event.EventMapper;
import org.example.demo.mapper.product.request.properties.ProductRequestMapper;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.product.properties.ProductRepository;
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IService<Product, Integer, ProductRequestDTO> {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductRequestMapper productRequestMapper;
    @Autowired
    private ProductResponseMapper productResponseMapper;
    @Autowired
    private ProductDetailRepository productDetailRepository;

    public List<?> findAllObject() {
        return productResponseMapper.toListDTO(productRepository.findAllObject());
    }

    public Page<ProductDTO> getAllProductDTO(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(EventMapper::toProductDTO);
    }

    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> findAllList() {
        return productRepository.findAllList();
    }



    public Page<ProductWithQuantityResponseDTO> findAllOverviewByPageV3(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return productRepository.findAllByPageWithQueryV2(query, createdFrom, createdTo, pageable);
    }



    @Override
    public Product findById(Integer id) throws BadRequestException {
        return productRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Produc not found with id: " + id));
    }

    public Product findByName(String name) throws BadRequestException {
        return productRepository.findByName(name)
                .orElseThrow(() -> new BadRequestException("Product not found with name: " + name));
    }


    @Override
    public Product delete(Integer id) throws BadRequestException {
        Product entityFound = findById(id);
        if (entityFound == null) {
            throw new BadRequestException("Product not found");
        }
        boolean currentDeletedState = entityFound.getDeleted();
        entityFound.setDeleted(!currentDeletedState);
        List<ProductDetail> productDetails = productDetailRepository.findByProductId(id);
        for (ProductDetail detail : productDetails) {
            detail.setDeleted(!currentDeletedState);
            productDetailRepository.save(detail);
        }

        return productRepository.save(entityFound);
    }
    @Override
    public Product save(ProductRequestDTO requestDTO) throws BadRequestException {
        boolean exists = productRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName());
        if (exists) {
            throw new BadRequestException("Product with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists.");
        }

        Product entityMapped = productRequestMapper.toEntity(requestDTO);
        entityMapped.setDeleted(false);
        return productRepository.save(entityMapped);
    }

    @Override
    public Product update(Integer id, ProductRequestDTO requestDTO) throws BadRequestException {
        Product entityFound = findById(id);
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return productRepository.save(entityFound);
    }

    @Transactional
    public List<Product> saveAll(List<ProductRequestDTO> requestDTOList) {
        List<Product> entityMapped = productRequestMapper.toListEntity(requestDTOList);
        return productRepository.saveAll(entityMapped);
    }

}
