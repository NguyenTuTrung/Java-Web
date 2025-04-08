package org.example.demo.service.product.properties;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.entity.product.properties.Image; // Đổi từ Elasticity sang Image
import org.example.demo.mapper.product.request.properties.ImageRequestMapper; // Đổi từ ElasticityRequestMapper sang ImageRequestMapper
import org.example.demo.mapper.product.response.properties.ImageResponseMapper;
import org.example.demo.repository.product.properties.ImageRepository; // Đổi từ ElasticityRepository sang ImageRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ImageService implements IService<Image, Integer, ImageRequestDTO> {

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private ImageRequestMapper imageRequestMapper;

    @Autowired
    private ImageResponseMapper imageResponseMapper;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public Image findById(Integer integer) throws BadRequestException {
        return null;
    }

    @Override
    public Image delete(Integer integer) throws BadRequestException {
        return null;
    }

    @Override
    public Image save(ImageRequestDTO requestDTO) throws BadRequestException {
        return null;
    }

    @Override
    public Image update(Integer integer, ImageRequestDTO requestDTO) throws BadRequestException {
        return null;
    }


    public String uploadImage(MultipartFile file) throws IOException {
        Map<String, String> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("url");
    }
}