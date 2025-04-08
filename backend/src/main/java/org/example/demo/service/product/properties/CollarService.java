package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.CollarRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar; // Đổi từ Brand sang Collar
import org.example.demo.mapper.product.request.properties.CollarRequestMapper; // Đổi từ BrandRequestMapper sang CollarRequestMapper
import org.example.demo.mapper.product.response.properties.CollarResponseMapper;
import org.example.demo.repository.product.properties.CollarRepository; // Đổi từ BrandRepository sang CollarRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollarService implements IService<Collar, Integer, CollarRequestDTO> { // Đổi từ BrandService sang CollarService

    @Autowired
    private CollarRepository collarRepository; // Đổi từ brandRepository sang collarRepository

    @Autowired
    private CollarRequestMapper collarRequestMapper; // Đổi từ brandRequestMapper sang collarRequestMapper

    @Autowired
    private CollarResponseMapper collarResponseMapper;

    public List<Collar> findAllObject() {
        return collarRepository.findAllObject();
    }

    public Page<CollarResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return collarRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> collarResponseMapper.toOverViewDTO(s));
    }

    public Page<Collar> findAll(Pageable pageable) { // Đổi từ Brand sang Collar
        return collarRepository.findAll(pageable);
    }
    public List<Collar> findAllList() {
        return collarRepository.findAllList();
    }
    @Override
    public Collar findById(Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        return collarRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Collar not found with id: " + id)); // Đổi từ Brand sang Collar
    }

    @Override
    public Collar delete(Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        Collar entityFound = findById(id); // Đổi từ Brand sang Collar
        entityFound.setDeleted(!entityFound.getDeleted());
        return collarRepository.save(entityFound); // Đổi từ brandRepository sang collarRepository
    }

    @Override
    public Collar save(CollarRequestDTO requestDTO) throws BadRequestException { // Đổi từ Brand sang Collar
        boolean exists = collarRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ brandRepository sang collarRepository
        if (exists) {
            throw new BadRequestException("Collar with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Brand sang Collar
        }

        Collar entityMapped = collarRequestMapper.toEntity(requestDTO); // Đổi từ Brand sang Collar
        entityMapped.setDeleted(false);
        return collarRepository.save(entityMapped); // Đổi từ brandRepository sang collarRepository
    }

    @Override
    public Collar update(Integer id, CollarRequestDTO requestDTO) throws BadRequestException { // Đổi từ Brand sang Collar
        Collar entityFound = findById(id); // Đổi từ Brand sang Collar
        entityFound.setName(requestDTO.getName());

        return collarRepository.save(entityFound); // Đổi từ brandRepository sang collarRepository
    }

    @Transactional
    public List<Collar> saveAll(List<CollarRequestDTO> requestDTOList) { // Đổi từ Brand sang Collar
        List<Collar> entityMapped = collarRequestMapper.toListEntity(requestDTOList); // Đổi từ Brand sang Collar
        return collarRepository.saveAll(entityMapped); // Đổi từ brandRepository sang collarRepository
    }

}