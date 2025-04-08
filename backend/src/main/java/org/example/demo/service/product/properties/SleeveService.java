package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.SleeveRequestDTO;
import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.dto.product.response.properties.SleeveResponseDTO;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.entity.product.properties.Sleeve; // Đổi từ Size sang Sleeve
import org.example.demo.mapper.product.request.properties.SleeveRequestMapper; // Đổi từ SizeRequestMapper sang SleeveRequestMapper
import org.example.demo.mapper.product.response.properties.SleeveResponseMapper;
import org.example.demo.repository.product.properties.SleeveRepository; // Đổi từ SizeRepository sang SleeveRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SleeveService implements IService<Sleeve, Integer, SleeveRequestDTO> { // Đổi từ SizeService sang SleeveService

    @Autowired
    private SleeveRepository sleeveRepository; // Đổi từ sizeRepository sang sleeveRepository

    @Autowired
    private SleeveRequestMapper sleeveRequestMapper; // Đổi từ sizeRequestMapper sang sleeveRequestMapper
    @Autowired
    private SleeveResponseMapper  sleeveResponseMapper;

    public List<Sleeve> findAllObject() {
        return sleeveRepository.findAllObject();
    }

    public Page<SleeveResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return sleeveRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> sleeveResponseMapper.toOverViewDTO(s));
    }

    public Page<Sleeve> findAll(Pageable pageable) { // Đổi từ Size sang Sleeve
        return sleeveRepository.findAll(pageable);
    }
    public List<Sleeve> findAllList() {
        return sleeveRepository.findAllList();
    }
    @Override
    public Sleeve findById(Integer id) throws BadRequestException { // Đổi từ Size sang Sleeve
        return sleeveRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Sleeve not found with id: " + id)); // Đổi từ Size sang Sleeve
    }

    @Override
    public Sleeve delete(Integer id) throws BadRequestException { // Đổi từ Size sang Sleeve
        Sleeve entityFound = findById(id); // Đổi từ Size sang Sleeve
        entityFound.setDeleted(!entityFound.getDeleted());
        return sleeveRepository.save(entityFound); // Đổi từ sizeRepository sang sleeveRepository
    }

    @Override
    public Sleeve save(SleeveRequestDTO requestDTO) throws BadRequestException { // Đổi từ Size sang Sleeve
        boolean exists = sleeveRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ sizeRepository sang sleeveRepository
        if (exists) {
            throw new BadRequestException("Sleeve with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Size sang Sleeve
        }

        Sleeve entityMapped = sleeveRequestMapper.toEntity(requestDTO); // Đổi từ Size sang Sleeve
        entityMapped.setDeleted(false);
        return sleeveRepository.save(entityMapped); // Đổi từ sizeRepository sang sleeveRepository
    }

    @Override
    public Sleeve update(Integer id, SleeveRequestDTO requestDTO) throws BadRequestException { // Đổi từ Size sang Sleeve
        Sleeve entityFound = findById(id); // Đổi từ Size sang Sleeve
        entityFound.setName(requestDTO.getName());

        return sleeveRepository.save(entityFound); // Đổi từ sizeRepository sang sleeveRepository
    }

    @Transactional
    public List<Sleeve> saveAll(List<SleeveRequestDTO> requestDTOList) { // Đổi từ Size sang Sleeve
        List<Sleeve> entityMapped = sleeveRequestMapper.toListEntity(requestDTOList); // Đổi từ Size sang Sleeve
        return sleeveRepository.saveAll(entityMapped); // Đổi từ sizeRepository sang sleeveRepository
    }

}