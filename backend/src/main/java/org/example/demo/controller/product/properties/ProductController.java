package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ProductRequestDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.dto.product.response.properties.ProductWithQuantityResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.product.request.properties.ProductRequestMapper;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.example.demo.repository.product.properties.ProductRepository;
import org.example.demo.service.product.properties.ProductService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("product")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRequestMapper productRequestMapper;
    @Autowired
    private ProductResponseMapper productResponseMapper;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/product-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(productService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }





    @RequestMapping(value = "overview")
    public ResponseEntity<Page<ProductWithQuantityResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(productService.findAllOverviewByPageV3( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/product-list")
    public ResponseEntity<Map<String, List<ProductResponseDTO>>> findAll() {
        List<Product> products = productService.findAllList();
        Map<String, List<ProductResponseDTO>> response = new HashMap<>();
        response.put("data", productResponseMapper.toListDTO(products));
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetailById(@PathVariable Integer id) throws BadRequestException {
        Product product = productService.findById(id);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductDetail not found");
        }
        return ResponseEntity.ok(productResponseMapper.toDTO(product));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductRequestDTO requestDTO) {
        try {
            Product updatedProduct = productService.update(id, requestDTO);
            return ResponseEntity.ok(productResponseMapper.toDTO(updatedProduct));
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) throws BadRequestException {
        try {
            productService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Product not found with id: "+id);
        }
    }
    @PostMapping("/save")
    public ResponseEntity<ProductResponseDTO> saveProduct(@RequestBody ProductRequestDTO requestDTO) {
        try {
            Product product = productService.save(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(productResponseMapper.toDTO(product));
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @GetMapping("/search/{name}")
    public ResponseEntity<Product> findByName(@PathVariable String name) throws BadRequestException {
        Product product = productService.findByName(name);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductDetail not found");
        }
        return ResponseEntity.ok(product);
    }

}
