package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.dto.product.requests.properties.ElasticityRequestDTO;
import org.example.demo.dto.product.response.properties.ColorResponseDTO;
import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Color;
import org.example.demo.entity.product.properties.Elasticity; // Đổi từ Color sang Elasticity
import org.example.demo.mapper.product.request.properties.ElasticityRequestMapper; // Đổi từ ColorRequestMapper sang ElasticityRequestMapper
import org.example.demo.mapper.product.response.properties.ElasticityResponseMapper;
import org.example.demo.repository.product.properties.ElasticityRepository; // Đổi từ ColorRepository sang ElasticityRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ElasticityService implements IService<Elasticity, Integer, ElasticityRequestDTO> { // Đổi từ ColorService sang ElasticityService

    @Autowired
    private ElasticityRepository elasticityRepository; // Đổi từ colorRepository sang elasticityRepository

    @Autowired
    private ElasticityRequestMapper elasticityRequestMapper; // Đổi từ colorRequestMapper sang elasticityRequestMapper

    @Autowired
    private ElasticityResponseMapper elasticityResponseMapper;

    public List<Elasticity> findAllObject() {
        return elasticityRepository.findAllObject();
    }

    public Page<ElasticityResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return elasticityRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> elasticityResponseMapper.toOverViewDTO(s));
    }

    public Page<Elasticity> findAll(Pageable pageable) { // Đổi từ Color sang Elasticity
        return elasticityRepository.findAll(pageable);
    }
    public List<Elasticity> findAllList() {
        return elasticityRepository.findAllList();
    }

    @Override
    public Elasticity findById(Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        return elasticityRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Elasticity not found with id: " + id)); // Đổi từ Color sang Elasticity
    }

    @Override
    public Elasticity delete(Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        Elasticity entityFound = findById(id); // Đổi từ Color sang Elasticity
        entityFound.setDeleted(!entityFound.getDeleted());
        return elasticityRepository.save(entityFound); // Đổi từ colorRepository sang elasticityRepository
    }


    @Override
    public Elasticity save(ElasticityRequestDTO requestDTO) throws BadRequestException { // Đổi từ Product sang Brand
        boolean exists = elasticityRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ productRepository sang brandRepository
        if (exists) {
            throw new BadRequestException("Elasticity with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Product sang Brand
        }

        Elasticity entityMapped = elasticityRequestMapper.toEntity(requestDTO); // Đổi từ Product sang Brand
        entityMapped.setDeleted(false);
        return elasticityRepository.save(entityMapped); // Đổi từ productRepository sang brandRepository
    }

    @Override
    public Elasticity update(Integer id, ElasticityRequestDTO requestDTO) throws BadRequestException { // Đổi từ Color sang Elasticity
        Elasticity entityFound = findById(id); // Đổi từ Color sang Elasticity
        entityFound.setName(requestDTO.getName());

        return elasticityRepository.save(entityFound); // Đổi từ colorRepository sang elasticityRepository
    }

    @Transactional
    public List<Elasticity> saveAll(List<ElasticityRequestDTO> requestDTOList) { // Đổi từ Color sang Elasticity
        List<Elasticity> entityMapped = elasticityRequestMapper.toListEntity(requestDTOList); // Đổi từ Color sang Elasticity
        return elasticityRepository.saveAll(entityMapped); // Đổi từ colorRepository sang elasticityRepository
    }

}