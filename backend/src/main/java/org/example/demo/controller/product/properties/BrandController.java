package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;

import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.product.properties.Brand; // Đổi từ Product sang Brand
import org.example.demo.mapper.product.request.properties.BrandRequestMapper; // Đổi từ ProductRequestMapper sang BrandRequestMapper
import org.example.demo.mapper.product.response.properties.BrandResponseMapper;
import org.example.demo.service.product.properties.BrandService; // Đổi từ ProductService sang BrandService
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("brand")
public class BrandController {
    @Autowired
    private BrandService brandService; // Đổi từ productService sang brandService
    @Autowired
    private BrandRequestMapper brandRequestMapper; // Đổi từ productRequestMapper sang brandRequestMapper
    @Autowired
    private BrandResponseMapper brandResponseMapper; // Đổi từ productResponseMapper sang brandResponseMapper

    @GetMapping("/brand-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(brandService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(brandService.findAll(pageable)); // Đổi từ productService sang brandService
    }


    @GetMapping("/brand-list")
    public ResponseEntity<Map<String, List<Brand>>> findAll() {
        List<Brand> brands = brandService.findAllList();
        Map<String, List<Brand>> response = new HashMap<>();
        response.put("data", brands);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "overview")
    public ResponseEntity<Page<BrandResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(brandService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Product sang Brand
        Brand brand = brandService.findById(id); // Đổi từ productService sang brandService
        if (brand == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BrandDetail not found"); // Đổi từ ProductDetail sang BrandDetail
        }
        return ResponseEntity.ok(brand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandRequestDTO requestDTO) {
        try {
            Brand updatedBrand = brandService.update(id, requestDTO);

            BrandResponseDTO responseDTO = new BrandResponseDTO(

                    updatedBrand.getId(),
                    updatedBrand.getCode(),
                    updatedBrand.getName(),
                    updatedBrand.getDeleted(),
                    updatedBrand.getCreatedDate(),
                    updatedBrand.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) throws BadRequestException { // Đổi từ Product sang Brand
        try {
            brandService.delete(id); // Đổi từ productService sang brandService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Brand not found with id: " + id); // Đổi từ Product sang Brand
        }
    }

    @PostMapping("/save")
    public ResponseEntity<BrandResponseDTO> saveBrand(@RequestBody BrandRequestDTO requestDTO) {
        try {
            Brand brand = brandService.save(requestDTO);

            BrandResponseDTO responseDTO = new BrandResponseDTO(
                    brand.getId(),
                    brand.getCode(),
                    brand.getName(),
                    brand.getDeleted(),
                    brand.getCreatedDate(),
                    brand.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}