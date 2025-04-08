package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.MaterialRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.MaterialResponseDTO;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.entity.product.properties.Material; // Đổi từ Image sang Material
import org.example.demo.mapper.product.request.properties.MaterialRequestMapper; // Đổi từ ImageRequestMapper sang MaterialRequestMapper
import org.example.demo.mapper.product.response.properties.MaterialResponseMapper;
import org.example.demo.service.product.properties.MaterialService; // Đổi từ ImageService sang MaterialService
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
@RequestMapping("material")
public class MaterialController {
    @Autowired
    private MaterialService materialService; // Đổi từ imageService sang materialService
    @Autowired
    private MaterialRequestMapper materialRequestMapper; // Đổi từ imageRequestMapper sang materialRequestMapper
    @Autowired
    private MaterialResponseMapper materialResponseMapper; // Đổi từ imageResponseMapper sang materialResponseMapper

    @GetMapping("/material-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(materialService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(materialService.findAll(pageable)); // Đổi từ imageService sang materialService
    }

    @GetMapping("/material-list")
    public ResponseEntity<Map<String, List<Material>>> findAll() {
        List<Material> materials = materialService.findAllList();
        Map<String, List<Material>> response = new HashMap<>();
        response.put("data", materials);
        return ResponseEntity.ok(response);
    }




    @RequestMapping(value = "overview")
    public ResponseEntity<Page<MaterialResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(materialService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Image sang Material
        Material material = materialService.findById(id); // Đổi từ imageService sang materialService
        if (material == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "MaterialDetail not found"); // Đổi từ ImageDetail sang MaterialDetail
        }
        return ResponseEntity.ok(material);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> updateMaterial(
            @PathVariable Integer id,
            @RequestBody MaterialRequestDTO requestDTO) { // Đổi từ ImageRequestDTO sang MaterialRequestDTO
        try {
            Material updatedMaterial = materialService.update(id, requestDTO); // Đổi từ imageService sang materialService

            MaterialResponseDTO responseDTO = new MaterialResponseDTO( // Đổi từ ImageResponseDTO sang MaterialResponseDTO
                    updatedMaterial.getId(),
                    updatedMaterial.getCode(),
                    updatedMaterial.getName(),
                    updatedMaterial.getDeleted(),
                    updatedMaterial.getCreatedDate(),
                    updatedMaterial.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Integer id) throws BadRequestException { // Đổi từ Image sang Material
        try {
            materialService.delete(id); // Đổi từ imageService sang materialService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Material not found with id: " + id); // Đổi từ Image sang Material
        }
    }

    @PostMapping("/save")
    public ResponseEntity<MaterialResponseDTO> saveMaterial(@RequestBody MaterialRequestDTO requestDTO) { // Đổi từ ImageRequestDTO sang MaterialRequestDTO
        try {
            Material material = materialService.save(requestDTO); // Đổi từ imageService sang materialService

            MaterialResponseDTO responseDTO = new MaterialResponseDTO( // Đổi từ ImageResponseDTO sang MaterialResponseDTO
                    material.getId(),
                    material.getCode(),
                    material.getName(),
                    material.getDeleted(),
                    material.getCreatedDate(),
                    material.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}