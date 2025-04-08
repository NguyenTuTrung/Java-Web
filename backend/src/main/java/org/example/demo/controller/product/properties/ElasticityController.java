package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ElasticityRequestDTO;
import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.entity.product.properties.Elasticity; // Đổi từ Color sang Elasticity
import org.example.demo.mapper.product.request.properties.ElasticityRequestMapper; // Đổi từ ColorRequestMapper sang ElasticityRequestMapper
import org.example.demo.mapper.product.response.properties.ElasticityResponseMapper;
import org.example.demo.service.product.properties.ElasticityService; // Đổi từ ColorService sang ElasticityService
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
@RequestMapping("elasticity")
public class ElasticityController {
    @Autowired
    private ElasticityService elasticityService; // Đổi từ colorService sang elasticityService
    @Autowired
    private ElasticityRequestMapper elasticityRequestMapper; // Đổi từ colorRequestMapper sang elasticityRequestMapper
    @Autowired
    private ElasticityResponseMapper elasticityResponseMapper; // Đổi từ colorResponseMapper sang elasticityResponseMapper

    @GetMapping("/elasticity-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(elasticityService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(elasticityService.findAll(pageable)); // Đổi từ colorService sang elasticityService
    }

    @GetMapping("/elasticity-list")
    public ResponseEntity<Map<String, List<Elasticity>>> findAll() {
        List<Elasticity> elasticitys = elasticityService.findAllList();
        Map<String, List<Elasticity>> response = new HashMap<>();
        response.put("data", elasticitys);
        return ResponseEntity.ok(response);
    }



    @RequestMapping(value = "overview")
    public ResponseEntity<Page<ElasticityResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(elasticityService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Elasticity> getElasticityDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        Elasticity elasticity = elasticityService.findById(id); // Đổi từ colorService sang elasticityService
        if (elasticity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ElasticityDetail not found"); // Đổi từ ColorDetail sang ElasticityDetail
        }
        return ResponseEntity.ok(elasticity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElasticityResponseDTO> updateElasticity(
            @PathVariable Integer id,
            @RequestBody ElasticityRequestDTO requestDTO) { // Đổi từ ColorRequestDTO sang ElasticityRequestDTO
        try {
            Elasticity updatedElasticity = elasticityService.update(id, requestDTO); // Đổi từ colorService sang elasticityService

            ElasticityResponseDTO responseDTO = new ElasticityResponseDTO( // Đổi từ ColorResponseDTO sang ElasticityResponseDTO
                    updatedElasticity.getId(),
                    updatedElasticity.getCode(),
                    updatedElasticity.getName(),
                    updatedElasticity.getDeleted(),
                    updatedElasticity.getCreatedDate(),
                    updatedElasticity.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElasticity(@PathVariable Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        try {
            elasticityService.delete(id); // Đổi từ colorService sang elasticityService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Elasticity not found with id: " + id); // Đổi từ Color sang Elasticity
        }
    }



    @PostMapping("/save")
    public ResponseEntity<ElasticityResponseDTO> saveBrand(@RequestBody ElasticityRequestDTO requestDTO) {
        try {
            Elasticity elasticity = elasticityService.save(requestDTO);

            ElasticityResponseDTO responseDTO = new ElasticityResponseDTO(
                    elasticity.getId(),
                    elasticity.getCode(),
                    elasticity.getName(),
                    elasticity.getDeleted(),
                    elasticity.getCreatedDate(),
                    elasticity.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}