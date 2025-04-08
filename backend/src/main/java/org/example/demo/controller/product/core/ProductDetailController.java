package org.example.demo.controller.product.core;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.phah04.request.FindProductDetailRequest;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.product.response.properties.ProductDiscountDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseOverDTO;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.mapper.event.response.EventResponseMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseNonEventMapper;
import org.example.demo.repository.event.EventRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.product.core.ProductDetailService;
import org.example.demo.util.event.EventUtil;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("productDetails")
public class ProductDetailController {

    @Autowired
    private ProductDetailRepository productDetailRepository; // dung nhanh tam

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductDetailResponseMapper productDetailResponseMapper;

    @Autowired
    private EventResponseMapper eventResponseMapper;

    @Autowired
    private ProductDetailResponseNonEventMapper productDetailResponseNonEventMapper;

    @GetMapping("")
    public ResponseEntity<Page<ProductDetail>> findAll(Pageable pageable) {
        Page<ProductDetail> productDetails = productDetailService.findAll(pageable);
        return ResponseEntity.ok(productDetails);
    }

    @GetMapping("/client")
    public org.example.demo.infrastructure.common.PageableObject findAll(FindProductDetailRequest request) {
        return (org.example.demo.infrastructure.common.PageableObject) productDetailService.getAll(request);
    }



    @PostMapping(value = "details")
    public ResponseEntity<Page<ProductDetailResponseDTO>> getProductDetails(
            @RequestParam(value = "productId", required = false) Integer productId,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "style", required = false) String style,
            @RequestParam(value = "texture", required = false) String texture,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "collar", required = false) String collar,
            @RequestParam(value = "sleeve", required = false) String sleeve,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam(value = "thickness", required = false) String thickness,
            @RequestParam(value = "elasticity", required = false) String elasticity,
            @Valid @RequestBody PageableObject pageableObject,

            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        System.out.println(pageableObject);

        Page<ProductDetailResponseDTO> productDetails = productDetailService.findAllProductDetailsOverviewByPage(
                productId,
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
                pageableObject
        );

        return ResponseEntity.ok(productDetails);
    }






    @GetMapping("getDataAttribute")
    public ResponseEntity<List<?>> getProductDetails(
            @RequestParam(required = false) Integer productId) {
        List<ProductDetail> productDetails = productDetailService.findAllByProductId(productId);
        return ResponseEntity.ok(productDetailResponseMapper.toListDTO(productDetails));
    }



    @PostMapping("findById")
    public ResponseEntity<?> getProductDetailById(
            @RequestParam(required = false) Integer id
    ) {
        if (id == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        try {
            ProductDetail productDetail = productDetailService.findById(id);
            return new ResponseEntity<>(productDetailResponseNonEventMapper.toDTO(productDetail), HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/save-all")
    public ResponseEntity<List<ProductDetail>> saveAllProducts(@RequestBody List<ProductDetailRequestDTO> requestDTOs) {
        try {
            List<ProductDetail> savedProducts = productDetailService.saveAll(requestDTOs);
            return ResponseEntity.ok(savedProducts);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetail> updateProductDetail(
            @PathVariable Integer id,
            @RequestBody @Valid ProductDetailRequestDTO productDetailRequestDTO
    ) {
        try {
            // Cập nhật ProductDetail thông qua service
            ProductDetail updatedProductDetail = productDetailService.update(id, productDetailRequestDTO);

            // Trả về ResponseEntity với mã trạng thái HTTP 200 và đối tượng đã cập nhật
            return ResponseEntity.ok(updatedProductDetail);
        } catch (BadRequestException e) {
            // Nếu có lỗi, trả về mã trạng thái 400 và thông điệp lỗi
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductDetail> deleteProductDetail(@PathVariable Integer id) {
        try {
            ProductDetail deletedProduct = productDetailService.delete(id);
            return new ResponseEntity<>(deletedProduct, HttpStatus.OK);
        } catch (BadRequestException e) {
            // Handle the BadRequestException if needed, e.g., return a custom message or status code
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetail> findById(@PathVariable Integer id) {
        try {
            ProductDetail productDetail = productDetailService.findById(id);
            return ResponseEntity.ok(productDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @GetMapping("by-code/{code}")
    public ResponseEntity<?> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(productDetailResponseMapper.toDTO(productDetailService.findByCode(code)));
    }

    @PostMapping("save")
    public ResponseEntity<ProductDetail> save(@Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail savedProductDetail = productDetailService.save(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<ProductDetail> update(@PathVariable Integer id, @Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail updatedProductDetail = productDetailService.update(id, requestDTO);
            return ResponseEntity.ok(updatedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            productDetailService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("saveAll")
    public ResponseEntity<List<ProductDetail>> saveAll(@Valid @RequestBody List<ProductDetailRequestDTO> requestDTOList) {
        System.out.println("--------------------");
        try {
            List<ProductDetail> savedProductDetails = productDetailService.saveAll(requestDTOList);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetails);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

//    @GetMapping("abc")
//    public ResponseEntity<?> custome(
//            @PageableDefault(page = 0, size = 10) Pageable pageable,
//            @RequestParam(value = "colorCodes", required = false) List<String> colorCodes,
//            @RequestParam(value = "sizeCodes", required = false) List<String> sizeCodes
//    ) {
//        colorCodes = Optional.ofNullable(colorCodes).filter(codes -> !codes.isEmpty()).orElse(null);
//        sizeCodes = Optional.ofNullable(sizeCodes).filter(codes -> !codes.isEmpty()).orElse(null);
//
//        Page<ProductResponseOverDTO> page = productDetailRepository.findCustomPage(pageable, sizeCodes, colorCodes);
//        List<ProductResponseOverDTO> productList = page.getContent();
//        List<Integer> productIds = productList.stream().map(ProductResponseOverDTO::getProductId).toList();
//        System.out.println("IDS" + productIds);
//        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);
//        System.out.println("listProductDetail SIZE " + listProductDetail.size());
//
//        productList.forEach(s -> {
//            Integer idPro = s.getProductId();
//            List<ProductDetail> listProd = listProductDetail.stream().filter(p -> p.getProduct().getId().equals(idPro)).toList();
//            System.out.println("listProductDetail 2" + listProd.size());
//            List<Image> productImages = new ArrayList<>();
//            listProd.forEach(pd -> {
//                System.out.println(pd.getCode());
//                System.out.println("-------");
//                productImages.addAll(pd.getImages());
//            });
//            s.setListColor(listProd.stream().map(pr -> pr.getColor()).toList());
//            s.setListSize(listProd.stream().map(pr -> pr.getSize()).toList());
//            s.setImage(productImages.stream().map(Image::getUrl).toList());
//            s.setPrice(listProd.stream().map(ProductDetail::getPrice).min(Double::compare).orElse(0.0)); // lấy giá nhỏ nhất
//        });
//        PageImpl<ProductResponseOverDTO> pageResponse = new PageImpl<>(productList, pageable, page.getTotalElements());
//        return ResponseEntity.ok(pageResponse);
//    }

//    @GetMapping("/new-in-last-week")
//    public List<ProductDetail> getNewProductsInLastWeek() {
//        LocalDateTime onWeekAgo = LocalDateTime.now().minusWeeks(1);
//        return productDetailRepository.findNewProductsInLastWeek(onWeekAgo);
//    }


    @GetMapping("/new-in-last-week")
    public ResponseEntity<?> custome2(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(value = "colorCodes", required = false) List<String> colorCodes,
            @RequestParam(value = "sizeCodes", required = false) List<String> sizeCodes,
            @RequestParam(value = "brandCodes", required = false) List<String> brandCodes,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "week", required = false) Boolean isWeek
    ) {
        isWeek = Optional.ofNullable(isWeek).orElse(false);
        colorCodes = Optional.ofNullable(colorCodes).filter(codes -> !codes.isEmpty()).orElse(null);
        sizeCodes = Optional.ofNullable(sizeCodes).filter(codes -> !codes.isEmpty()).orElse(null);
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Page<ProductResponseOverDTO> page = productDetailRepository.findCustomPage2(
                pageable, sizeCodes, colorCodes, brandCodes, minPrice, maxPrice, oneWeekAgo
        );
        List<ProductResponseOverDTO> productList = page.getContent();
        List<Integer> productIds = productList.stream().map(ProductResponseOverDTO::getProductId).toList();
        List<Event> events = eventRepository.findListEventUseValid();
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);

        Map<Integer, List<ProductDetail>> productDetailsMap = listProductDetail.stream()
                .collect(Collectors.groupingBy(pd -> pd.getProduct().getId()));

        Map<Integer, List<Event>> productEventsMap = events.stream()
                .flatMap(event -> event.getProducts().stream()
                        .map(product -> new AbstractMap.SimpleEntry<>(product.getId(), event)))
                .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.mapping(Map.Entry::getValue, Collectors.toList())));

        productList.forEach(s -> {
            Integer idPro = s.getProductId();
            List<ProductDetail> listProd = productDetailsMap.getOrDefault(idPro, Collections.emptyList());

            s.setListColor(listProd.stream().map(ProductDetail::getColor).toList());
            s.setListSize(listProd.stream().map(ProductDetail::getSize).toList());
            s.setImage(listProd.stream().flatMap(pd -> pd.getImages().stream().map(Image::getUrl)).toList());
            s.setPrice(listProd.stream().map(ProductDetail::getPrice).min(Double::compare).orElse(0.0));

            List<Event> evv = productEventsMap.getOrDefault(idPro, Collections.emptyList());
            s.setListEvent(eventResponseMapper.toListDTO(evv));
            double avgDiscount = EventUtil.getAveragePercentEvent(evv);
            s.setDiscountPercent((long) avgDiscount);
        });

        PageImpl<ProductResponseOverDTO> pageResponse = new PageImpl<>(productList, pageable, page.getTotalElements());
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/event")
    public ResponseEntity<?> custome3(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(value = "colorCodes", required = false) List<String> colorCodes,
            @RequestParam(value = "sizeCodes", required = false) List<String> sizeCodes,
            @RequestParam(value = "brandCodes", required = false) List<String> brandCodes,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "eventDiscountPercent",required = false) Long eventDiscountPercent,
            @RequestParam(value = "eventQuantityDiscount",required = false ) Long eventQuantityDiscount
    ) {
        colorCodes = Optional.ofNullable(colorCodes).filter(codes -> !codes.isEmpty()).orElse(null);
        sizeCodes = Optional.ofNullable(sizeCodes).filter(codes -> !codes.isEmpty()).orElse(null);

        Page<ProductDiscountDTO> page = productDetailRepository.findCustomeByEvent(
                pageable, sizeCodes, colorCodes, brandCodes, minPrice, maxPrice,eventDiscountPercent, eventQuantityDiscount
        );

        List<ProductDiscountDTO> productList = page.getContent();
        List<Integer> productIds = productList.stream().map(ProductDiscountDTO::getProductId).toList();

        List<Event> events = eventRepository.findListEventUseValid();
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);

        Map<Integer, List<ProductDetail>> productDetailsMap = listProductDetail.stream()
                .collect(Collectors.groupingBy(pd -> pd.getProduct().getId()));

        Map<Integer, List<Event>> productEventsMap = events.stream()
                .flatMap(event -> event.getProducts().stream()
                        .map(product -> new AbstractMap.SimpleEntry<>(product.getId(), event)))
                .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.mapping(Map.Entry::getValue, Collectors.toList())));

        productList.forEach(s -> {
            Integer idPro = s.getProductId();
            List<ProductDetail> listProd = productDetailsMap.getOrDefault(idPro, Collections.emptyList());

            s.setListColor(listProd.stream().map(ProductDetail::getColor).toList());
            s.setListSize(listProd.stream().map(ProductDetail::getSize).toList());
            s.setImage(listProd.stream().flatMap(pd -> pd.getImages().stream().map(Image::getUrl)).toList());
            s.setPrice(listProd.stream().map(ProductDetail::getPrice).min(Double::compare).orElse(0.0));

            List<Event> evv = productEventsMap.getOrDefault(idPro, Collections.emptyList());
            s.setListEvent(eventResponseMapper.toListDTO(evv));
            double avgDiscount = EventUtil.getAveragePercentEvent(evv);
            s.setDiscountPercent((long) avgDiscount);
        });

        PageImpl<ProductDiscountDTO> pageResponse = new PageImpl<>(productList, pageable, page.getTotalElements());
        return ResponseEntity.ok(pageResponse);
    }


    @GetMapping("abc")
    public ResponseEntity<?> custome(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(value = "colorCodes", required = false) List<String> colorCodes,
            @RequestParam(value = "sizeCodes", required = false) List<String> sizeCodes,
            @RequestParam(value = "brandCodes", required = false) List<String> brandCodes,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "query", required = false) String query
    ) {

        colorCodes = Optional.ofNullable(colorCodes).filter(codes -> !codes.isEmpty()).orElse(null);
        sizeCodes = Optional.ofNullable(sizeCodes).filter(codes -> !codes.isEmpty()).orElse(null);

        Page<ProductResponseOverDTO> page = productDetailRepository.findCustomPage(pageable, sizeCodes, colorCodes, brandCodes, minPrice, maxPrice, query);
        List<ProductResponseOverDTO> productList = page.getContent();
        List<Integer> productIds = productList.stream().map(ProductResponseOverDTO::getProductId).toList();
        List<Event> events = eventRepository.findListEventUseValid();


        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);

        productList.forEach(s -> {
            Integer idPro = s.getProductId();
            List<ProductDetail> listProd = listProductDetail.stream().filter(p -> p.getProduct().getId().equals(idPro)).toList();
            List<Image> productImages = new ArrayList<>();
            listProd.forEach(pd -> productImages.addAll(pd.getImages()));

            s.setListColor(listProd.stream().map(ProductDetail::getColor).filter(e -> !e.getDeleted()).toList());
            s.setListSize(listProd.stream().map(ProductDetail::getSize).filter(e -> !e.getDeleted()).toList());
            s.setImage(productImages.stream().map(Image::getUrl).toList());
            s.setPrice(listProd.stream().map(ProductDetail::getPrice).min(Double::compare).orElse(0.0));

            //set events
            List<Event> evv = new ArrayList<>();
            events.forEach(event -> {
                List<Integer> id_products = event.getProducts().stream().map(BaseEntity::getId).toList();
                if (id_products.contains(s.getProductId())) {
                    evv.add(event);
                }
            });
            s.setListEvent(eventResponseMapper.toListDTO(evv));
            double avgDiscount = EventUtil.getAveragePercentEvent(evv);
            s.setDiscountPercent((long) avgDiscount);

        });

        PageImpl<ProductResponseOverDTO> pageResponse = new PageImpl<>(productList, pageable, page.getTotalElements());
        return ResponseEntity.ok(pageResponse);
    }


    @GetMapping("detail-information/{id}")
    public ResponseEntity<?> detail_information(
            @PathVariable("id") Integer id
    ) {
        List<ProductResponseOverDTO> productList = productDetailRepository.findCustomListByProductId(id);
        List<Integer> productIds = productList.stream().map(ProductResponseOverDTO::getProductId).toList();
        System.out.println("IDS" + productIds);
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);
        System.out.println("listProductDetail SIZE " + listProductDetail.size());

        productList.forEach(s -> {
            Integer idPro = s.getProductId();
            List<ProductDetail> listProd = listProductDetail.stream().filter(p -> p.getProduct().getId().equals(idPro)).toList();
            System.out.println("listProductDetail 2" + listProd.size());
            List<Image> productImages = new ArrayList<>();
            listProd.forEach(pd -> {
                System.out.println(pd.getCode());
                System.out.println("-------");
                productImages.addAll(pd.getImages());
            });
            s.setListColor(listProd.stream().map(pr -> pr.getColor()).toList());
            s.setListSize(listProd.stream().map(pr -> pr.getSize()).toList());
            s.setImage(productImages.stream().map(Image::getUrl).toList());
        });
        return ResponseEntity.ok(productList);
    }

    @GetMapping("abc/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") Integer id) {
        Optional<ProductResponseOverDTO> productResponseOverDTOOptional = productDetailRepository.findOneCustom(id);
        if (productResponseOverDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProductResponseOverDTO productResponseOverDTO = productResponseOverDTOOptional.get();
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(List.of(id));
        List<Image> productImages = new ArrayList<>();
        listProductDetail.forEach(pd -> {
            productImages.addAll(pd.getImages());
        });
        productResponseOverDTO.setImage(productImages.stream().map(Image::getUrl).toList());
        return ResponseEntity.ok(productResponseOverDTO);
    }

    @GetMapping("product-detail-of-product/{id}")
    public ResponseEntity<?> findProductDetailOfProduct(@PathVariable Integer id) {
        List<ProductDetail> list = productDetailRepository.findAllByProductId(id);
        return ResponseEntity.ok(productDetailResponseMapper.toListDTO(list));
    }


    @GetMapping("product-detail-of-product/hung/{id}")
    public ResponseEntity<?> findProductDetailOfProductAndImages(@PathVariable("id") Integer id) {
        Optional<ProductResponseOverDTO> productResponseOverDTOOptional = productDetailRepository.findOneCustom(id);
        if (productResponseOverDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProductResponseOverDTO productResponseOverDTO = productResponseOverDTOOptional.get();
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(List.of(id));
        List<Image> productImages = new ArrayList<>();
        listProductDetail.forEach(pd -> {
            productImages.addAll(pd.getImages());
        });
        productResponseOverDTO.setImage(productImages.stream().map(Image::getUrl).toList());
        return ResponseEntity.ok(productResponseOverDTO);
    }



}
