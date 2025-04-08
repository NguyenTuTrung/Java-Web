package org.example.demo.service.product.core;

import com.google.zxing.WriterException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.phah04.request.FindProductDetailRequest;
import org.example.demo.dto.product.phah04.response.ProductClientResponse;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.requests.properties.MaterialRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.*;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.product.request.core.ProductDetailRequestMapper;
import org.example.demo.mapper.product.request.properties.*;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.mapper.product.response.properties.ColorResponseMapper;
import org.example.demo.mapper.product.response.properties.SizeResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.product.properties.BrandRepository;
import org.example.demo.repository.product.properties.ImageRepository;
import org.example.demo.service.IService;
import org.example.demo.util.FileUploadUtil;
import org.example.demo.util.phah04.PageableObject;
import org.example.demo.util.qr.QRUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProductDetailService implements IService<ProductDetail, Integer, ProductDetailRequestDTO> {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductDetailRequestMapper productDetailRequestMapper;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductDetailResponseMapper productDetailResponseMapper;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private SizeRequestMapper sizeRequestMapper;

    @Autowired
    private ColorRequestMapper colorRequestMapper;

    @Autowired
    private TextureRequestMapper textureRequestMapper;

    @Autowired
    private OriginRequestMapper originRequestMapper;

    @Autowired
    private CollarRequestMapper collarRequestMapper;

    @Autowired
    private SleeveRequestMapper sleeveRequestMapper;

    @Autowired
    private MaterialRequestMapper materialRequestMapper;

    @Autowired
    private ThicknessRequestMapper thicknessRequestMapper;

    @Autowired
    private StyleRequestMapper styleRequestMapper;

    @Autowired
    private ElasticityRequestMapper elasticityRequestMapper;

    @Autowired
    private BrandRequestMapper brandRequestMapper;

    @Autowired
    private ProductRequestMapper productRequestMapper;

    @Override
    public ProductDetail findById(Integer id) throws BadRequestException {
        return productDetailRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("ProductDetail not found with id: " + id));
    }

    public Page<ProductDetail> findAll(Pageable pageable) {
        return productDetailRepository.findAll(pageable);
    }


    public Page<ProductClientResponse> getAll(FindProductDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() -1, request.getSizePage());
        FindProductDetailRequest customRequest = FindProductDetailRequest.builder()
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .products(request.getProduct() != null ? Arrays.asList(request.getProduct().split(",")) : null)
                .size(request.getSize())
                .color(request.getColor())
                .product(request.getProduct())
                .build();
        return (Page<ProductClientResponse>) new org.example.demo.infrastructure.common.PageableObject<>(productDetailRepository.productClient(customRequest, pageable));
    }

    // Phương thức tìm tất cả sản phẩm chi tiết với điều kiện phân trang
    public Page<ProductDetailResponseDTO> findAllProductDetailsOverviewByPage(
            Integer productId,
            String size,
            String color,
            String style,
            String texture,
            String origin,
            String brand,
            String collar,
            String sleeve,
            String material,
            String thickness,
            String elasticity,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        Page<ProductDetail> productDetails = productDetailRepository.findAllByProductIdWithQuery(
                productId,
                query,
                size,
                color,
                style,
                texture,
                origin,
                brand,
                collar,
                sleeve,
                material,
                thickness,
                elasticity,
                pageable
        );

        return productDetails.map(s -> productDetailResponseMapper.toDTO(s));
    }


    public List<ProductDetail> findAllByProductId(Integer productId) {
        return productDetailRepository.findAllByProductIdv2(productId);
    }

    @Override
    public ProductDetail delete(Integer id) throws BadRequestException {
        ProductDetail entityFound = findById(id);

        entityFound.setDeleted(!entityFound.getDeleted());
        return productDetailRepository.save(entityFound);
    }



    @Override
    public ProductDetail save(ProductDetailRequestDTO requestDTO) throws BadRequestException {
        return null;
    }


    @Override
    public ProductDetail update(Integer id, ProductDetailRequestDTO requestDTO) throws BadRequestException {
        // Tìm kiếm ProductDetail theo id
        ProductDetail existingProductDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("ProductDetail with id " + id + " not found"));

        Size size = sizeRequestMapper.toEntity(requestDTO.getSize());
        Color color = colorRequestMapper.toEntity(requestDTO.getColor());
        Texture texture = textureRequestMapper.toEntity(requestDTO.getTexture());
        Origin origin = originRequestMapper.toEntity(requestDTO.getOrigin());
        Collar collar = collarRequestMapper.toEntity(requestDTO.getCollar());
        Sleeve sleeve = sleeveRequestMapper.toEntity(requestDTO.getSleeve());
        Style style = styleRequestMapper.toEntity(requestDTO.getStyle());
        Material material = materialRequestMapper.toEntity(requestDTO.getMaterial());
        Thickness thickness = thicknessRequestMapper.toEntity(requestDTO.getThickness());
        Elasticity elasticity = elasticityRequestMapper.toEntity(requestDTO.getElasticity());
        // Cập nhật các trường khác trong ProductDetail
        existingProductDetail.setPrice(requestDTO.getPrice());
        existingProductDetail.setSize(size);
        existingProductDetail.setColor(color);
        existingProductDetail.setTexture(texture);
        existingProductDetail.setOrigin(origin);
        existingProductDetail.setCollar(collar);
        existingProductDetail.setSleeve(sleeve);
        existingProductDetail.setStyle(style);
        existingProductDetail.setMaterial(material);
        existingProductDetail.setThickness(thickness);
        existingProductDetail.setElasticity(elasticity);
        existingProductDetail.setQuantity(requestDTO.getQuantity());
        existingProductDetail.setMass(requestDTO.getMass());

        // Cập nhật thương hiệu (brand)
        Brand brand = brandRepository.findById(requestDTO.getBrand().getId())
                .orElseThrow(() -> new BadRequestException("Brand not found"));
        existingProductDetail.setBrand(brand);

        // Kiểm tra và cập nhật ảnh
        if (requestDTO.getImages() != null && !requestDTO.getImages().isEmpty()) {
            List<Image> imagesFromDTO = createImagesFromDTO(requestDTO.getImages());

            // Tạo danh sách các ID ảnh từ request
            List<String> imageIdsFromDTO = imagesFromDTO.stream()
                    .map(image -> image.getId().toString()) // Chuyển Integer (nếu có) thành String
                    .collect(Collectors.toList());

            // Tạo danh sách ảnh hiện tại từ ProductDetail
            List<Image> imagesToDelete = existingProductDetail.getImages().stream()
                    .filter(image -> !imageIdsFromDTO.contains(image.getId().toString()))  // So sánh id dưới dạng String
                    .collect(Collectors.toList());

            // Xóa các ảnh không còn trong danh sách
            existingProductDetail.getImages().removeAll(imagesToDelete);

            // Cập nhật lại danh sách ảnh
            existingProductDetail.setImages(imagesFromDTO);
        } else {
            // Nếu không có ảnh mới, xóa toàn bộ ảnh
            existingProductDetail.setImages(new ArrayList<>());
        }

        // Lưu và trả về ProductDetail đã được cập nhật
        return productDetailRepository.save(existingProductDetail);
    }




    @Transactional
    public List<ProductDetail> saveAll(List<ProductDetailRequestDTO> requestDTOs) throws IOException {
        List<ProductDetail> savedProductDetails = new ArrayList<>();

        for (ProductDetailRequestDTO requestDTO : requestDTOs) {
            ProductDetail savedProductDetail = handleProductDetailSave(requestDTO);

            try{
                BufferedImage bufferedImage = QRUtil.generateQRCodeWithoutBorder(savedProductDetail.getCode(), 200, 200);
                FileUploadUtil.saveProductQR(savedProductDetail.getCode(), bufferedImage);
            }catch (Exception ex){
                log.error("Lu file error");
            }

            savedProductDetails.add(savedProductDetail);
        }

        return savedProductDetails;
    }

    private ProductDetail handleProductDetailSave(ProductDetailRequestDTO requestDTO) throws BadRequestException {

        Size size = sizeRequestMapper.toEntity(requestDTO.getSize());
        Color color = colorRequestMapper.toEntity(requestDTO.getColor());
        Texture texture = textureRequestMapper.toEntity(requestDTO.getTexture());
        Origin origin = originRequestMapper.toEntity(requestDTO.getOrigin());
        Collar collar = collarRequestMapper.toEntity(requestDTO.getCollar());
        Sleeve sleeve = sleeveRequestMapper.toEntity(requestDTO.getSleeve());
        Style style = styleRequestMapper.toEntity(requestDTO.getStyle());
        Material material = materialRequestMapper.toEntity(requestDTO.getMaterial());
        Thickness thickness = thicknessRequestMapper.toEntity(requestDTO.getThickness());
        Elasticity elasticity = elasticityRequestMapper.toEntity(requestDTO.getElasticity());
        Brand brandFound = brandRequestMapper.toEntity(requestDTO.getBrand());
        Product product = productRequestMapper.toEntity(requestDTO.getProduct());

        ProductDetail existingProductDetail = productDetailRepository.findByAttributes(
                size,
                color,
                texture,
                origin,
                brandFound,
                collar,
                sleeve,
                style,
                material,
                thickness,
                elasticity,
                product
        );

        if (existingProductDetail != null) {
                existingProductDetail.setQuantity(existingProductDetail.getQuantity() + requestDTO.getQuantity());
                System.out.println("Updating product detail: " + existingProductDetail);
                return productDetailRepository.save(existingProductDetail);

        }
        ProductDetail entityMapped = productDetailRequestMapper.toEntity(requestDTO);
        Brand brand = brandRepository.findById(requestDTO.getBrand().getId())
                .orElseThrow(() -> new BadRequestException("Brand not found"));
        entityMapped.setBrand(brand);
        entityMapped.setDeleted(false);
        if (requestDTO.getImages() != null && !requestDTO.getImages().isEmpty()) {
            List<Image> images = createImagesFromDTO(requestDTO.getImages());
            entityMapped.setImages(images);
        }
        return productDetailRepository.save(entityMapped);
    }





    private List<Image> createImagesFromDTO(List<ImageRequestDTO> imageRequestDTOs) {
        List<ImageRequestDTO> uniqueList = imageRequestDTOs.stream()
                .collect(Collectors.toMap(
                        ImageRequestDTO::getCode,
                        a -> a,    // Giá trị là chính đối tượng A
                        (existing, replacement) -> existing // Giữ lại đối tượng đầu tiên nếu trùng
                ))
                .values()
                .stream()
                .collect(Collectors.toList());

        System.out.println("Unique images: " + uniqueList.size());

        return uniqueList.stream().map(imageRequestDTO -> {
            System.out.println("==================");

            // Kiểm tra xem ảnh đã tồn tại chưa
            Optional<Image> existingImage = imageRepository.findByCode(imageRequestDTO.getCode());

            if (existingImage.isEmpty()) {
                // Nếu ảnh chưa tồn tại, lưu ảnh mới
                System.out.println("Saving new image: " + imageRequestDTO.toString());
                Image image = new Image();
                image.setCode(imageRequestDTO.getCode());
                image.setUrl(imageRequestDTO.getUrl());
                image.setDeleted(imageRequestDTO.getDeleted());
                return imageRepository.save(image);
            }

            // Nếu ảnh đã tồn tại, trả về ảnh đã tồn tại
            return existingImage.get();
        }).collect(Collectors.toList());
    }

    public ProductDetail findByCode(String code) {
        return productDetailRepository.findByCode(code)
                .orElseThrow(() -> new CustomExceptions.CustomBadRequest("ProductDetail not found with code: " + code));
    }
}