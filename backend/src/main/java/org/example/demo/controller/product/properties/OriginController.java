package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.dto.product.requests.properties.OriginRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.OriginResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Material;
import org.example.demo.entity.product.properties.Origin; // Đổi từ Material sang Origin
import org.example.demo.mapper.product.request.properties.OriginRequestMapper; // Đổi từ MaterialRequestMapper sang OriginRequestMapper
import org.example.demo.mapper.product.response.properties.OriginResponseMapper;
import org.example.demo.service.product.properties.OriginService; // Đổi từ MaterialService sang OriginService
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
@RequestMapping("origin")
public class OriginController {
    @Autowired
    private OriginService originService; // Đổi từ materialService sang originService
    @Autowired
    private OriginRequestMapper originRequestMapper; // Đổi từ materialRequestMapper sang originRequestMapper
    @Autowired
    private OriginResponseMapper originResponseMapper; // Đổi từ materialResponseMapper sang originResponseMapper

    @GetMapping("/origin-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(originService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(originService.findAll(pageable)); // Đổi từ materialService sang originService
    }

    @GetMapping("/origin-list")
    public ResponseEntity<Map<String, List<Origin>>> findAll() {
        List<Origin> origins = originService.findAllList();
        Map<String, List<Origin>> response = new HashMap<>();
        response.put("data", origins);
        return ResponseEntity.ok(response);
    }





    @RequestMapping(value = "overview")
    public ResponseEntity<Page<OriginResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(originService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Origin> getOriginDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Material sang Origin
        Origin origin = originService.findById(id); // Đổi từ materialService sang originService
        if (origin == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "OriginDetail not found"); // Đổi từ MaterialDetail sang OriginDetail
        }
        return ResponseEntity.ok(origin);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OriginResponseDTO> updateOrigin(
            @PathVariable Integer id,
            @RequestBody OriginRequestDTO requestDTO) { // Đổi từ MaterialRequestDTO sang OriginRequestDTO
        try {
            Origin updatedOrigin = originService.update(id, requestDTO); // Đổi từ materialService sang originService

            OriginResponseDTO responseDTO = new OriginResponseDTO( // Đổi từ MaterialResponseDTO sang OriginResponseDTO
                    updatedOrigin.getId(),
                    updatedOrigin.getCode(),
                    updatedOrigin.getName(),
                    updatedOrigin.getDeleted(),
                    updatedOrigin.getCreatedDate(),
                    updatedOrigin.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrigin(@PathVariable Integer id) throws BadRequestException { // Đổi từ Material sang Origin
        try {
            originService.delete(id); // Đổi từ materialService sang originService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Origin not found with id: " + id); // Đổi từ Material sang Origin
        }
    }

    @PostMapping("/save")
    public ResponseEntity<OriginResponseDTO> saveOrigin(@RequestBody OriginRequestDTO requestDTO) {
        try {
            Origin origin = originService.save(requestDTO);

            OriginResponseDTO responseDTO = new OriginResponseDTO(
                    origin.getId(),
                    origin.getCode(),
                    origin.getName(),
                    origin.getDeleted(),
                    origin.getCreatedDate(),
                    origin.getUpdatedDate() // Đảm bảo trường này được thiết lập đúng
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}