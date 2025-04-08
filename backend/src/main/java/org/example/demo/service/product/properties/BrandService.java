package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Brand; // Đổi từ Product sang Brand
import org.example.demo.mapper.product.request.properties.BrandRequestMapper; // Đổi từ ProductRequestMapper sang BrandRequestMapper
import org.example.demo.mapper.product.response.properties.BrandResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.product.properties.BrandRepository; // Đổi từ ProductRepository sang BrandRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BrandService implements IService<Brand, Integer, BrandRequestDTO> { // Đổi từ ProductService sang BrandService



    @Autowired
    private BrandRepository brandRepository; // Đổi từ productRepository sang brandRepository

    @Autowired
    private BrandRequestMapper brandRequestMapper; // Đổi từ productRequestMapper sang brandRequestMapper

    @Autowired
    private BrandResponseMapper brandResponseMapper;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    public Page<Brand> findAll(Pageable pageable) { // Đổi từ Product sang Brand
        return brandRepository.findAll(pageable);
    }

    public List<Brand> findAllList() {
        return brandRepository.findAllList();
    }

    public List<Brand> findAllObject() {
        return brandRepository.findAllObject();
    }




    


    public Page<BrandResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return brandRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> brandResponseMapper.toOverViewDTO(s));
    }

    @Override
    public Brand findById(Integer id) throws BadRequestException {
        return brandRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Brand not found with id: " + id));
    }


    @Override
    public Brand delete(Integer id) throws BadRequestException {
        Brand entityFound = findById(id);
        if (entityFound == null) {
            throw new BadRequestException("Brand not found");
        }
        boolean currentDeletedState = entityFound.getDeleted();
        entityFound.setDeleted(!entityFound.getDeleted());
        List<ProductDetail> productDetails = productDetailRepository.findByProductId(id);
        for (ProductDetail detail : productDetails) {
            detail.setDeleted(!currentDeletedState);
            productDetailRepository.save(detail);
        }
        return brandRepository.save(entityFound);
    }



    @Override
    public Brand save(BrandRequestDTO requestDTO) throws BadRequestException { // Đổi từ Product sang Brand
        boolean exists = brandRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ productRepository sang brandRepository
        if (exists) {
            throw new BadRequestException("Brand with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Product sang Brand
        }

        Brand entityMapped = brandRequestMapper.toEntity(requestDTO); // Đổi từ Product sang Brand
        entityMapped.setDeleted(false);
        return brandRepository.save(entityMapped); // Đổi từ productRepository sang brandRepository
    }

    @Override
    public Brand update(Integer id, BrandRequestDTO requestDTO) throws BadRequestException { // Đổi từ Product sang Brand
        Brand entityFound = findById(id); // Đổi từ Product sang Brand
        entityFound.setName(requestDTO.getName());

        return brandRepository.save(entityFound); // Đổi từ productRepository sang brandRepository
    }

    @Transactional
    public List<Brand> saveAll(List<BrandRequestDTO> requestDTOList) { // Đổi từ Product sang Brand
        List<Brand> entityMapped = brandRequestMapper.toListEntity(requestDTOList); // Đổi từ Product sang Brand
        return brandRepository.saveAll(entityMapped); // Đổi từ productRepository sang brandRepository
    }

}