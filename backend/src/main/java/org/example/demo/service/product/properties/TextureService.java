package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.TextureRequestDTO;
import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.dto.product.response.properties.TextureResponseDTO;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.entity.product.properties.Texture; // Đổi từ Style sang Texture
import org.example.demo.mapper.product.request.properties.TextureRequestMapper; // Đổi từ StyleRequestMapper sang TextureRequestMapper
import org.example.demo.mapper.product.response.properties.TextureResponseMapper;
import org.example.demo.repository.product.properties.TextureRepository; // Đổi từ StyleRepository sang TextureRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TextureService implements IService<Texture, Integer, TextureRequestDTO> { // Đổi từ StyleService sang TextureService

    @Autowired
    private TextureRepository textureRepository; // Đổi từ styleRepository sang textureRepository

    @Autowired
    private TextureRequestMapper textureRequestMapper; // Đổi từ styleRequestMapper sang textureRequestMapper
    @Autowired
    private TextureResponseMapper textureResponseMapper;

    public List<Texture> findAllObject() {
        return textureRepository.findAllObject();
    }

    public Page<TextureResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return textureRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> textureResponseMapper.toOverViewDTO(s));
    }

    public Page<Texture> findAll(Pageable pageable) { // Đổi từ Style sang Texture
        return textureRepository.findAll(pageable);
    }
    public List<Texture> findAllList() {
        return textureRepository.findAllList();
    }
    @Override
    public Texture findById(Integer id) throws BadRequestException { // Đổi từ Style sang Texture
        return textureRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Texture not found with id: " + id)); // Đổi từ Style sang Texture
    }

    @Override
    public Texture delete(Integer id) throws BadRequestException { // Đổi từ Style sang Texture
        Texture entityFound = findById(id); // Đổi từ Style sang Texture
        entityFound.setDeleted(!entityFound.getDeleted());
        return textureRepository.save(entityFound); // Đổi từ styleRepository sang textureRepository
    }

    @Override
    public Texture save(TextureRequestDTO requestDTO) throws BadRequestException { // Đổi từ Style sang Texture
        boolean exists = textureRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ styleRepository sang textureRepository
        if (exists) {
            throw new BadRequestException("Texture with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Style sang Texture
        }

        Texture entityMapped = textureRequestMapper.toEntity(requestDTO); // Đổi từ Style sang Texture
        entityMapped.setDeleted(false);
        return textureRepository.save(entityMapped); // Đổi từ styleRepository sang textureRepository
    }

    @Override
    public Texture update(Integer id, TextureRequestDTO requestDTO) throws BadRequestException { // Đổi từ Style sang Texture
        Texture entityFound = findById(id); // Đổi từ Style sang Texture
        entityFound.setName(requestDTO.getName());

        return textureRepository.save(entityFound); // Đổi từ styleRepository sang textureRepository
    }

    @Transactional
    public List<Texture> saveAll(List<TextureRequestDTO> requestDTOList) { // Đổi từ Style sang Texture
        List<Texture> entityMapped = textureRequestMapper.toListEntity(requestDTOList); // Đổi từ Style sang Texture
        return textureRepository.saveAll(entityMapped); // Đổi từ styleRepository sang textureRepository
    }

}