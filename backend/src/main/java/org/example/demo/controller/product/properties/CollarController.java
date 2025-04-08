package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.CollarRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Collar; // Đổi từ Brand sang Collar
import org.example.demo.mapper.product.request.properties.CollarRequestMapper; // Đổi từ BrandRequestMapper sang CollarRequestMapper
import org.example.demo.mapper.product.response.properties.CollarResponseMapper;
import org.example.demo.service.product.properties.CollarService; // Đổi từ BrandService sang CollarService
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
@RequestMapping("collar")
public class CollarController {
    @Autowired
    private CollarService collarService; // Đổi từ brandService sang collarService
    @Autowired
    private CollarRequestMapper collarRequestMapper; // Đổi từ brandRequestMapper sang collarRequestMapper
    @Autowired
    private CollarResponseMapper collarResponseMapper; // Đổi từ brandResponseMapper sang collarResponseMapper

    @GetMapping("/collar-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(collarService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(collarService.findAll(pageable)); // Đổi từ brandService sang collarService
    }

    @GetMapping("/collar-list")
    public ResponseEntity<Map<String, List<Collar>>> findAll() {
        List<Collar> collars = collarService.findAllList();
        Map<String, List<Collar>> response = new HashMap<>();
        response.put("data", collars);
        return ResponseEntity.ok(response);
    }


    @RequestMapping(value = "overview")
    public ResponseEntity<Page<CollarResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(collarService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Collar> getCollarDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        Collar collar = collarService.findById(id); // Đổi từ brandService sang collarService
        if (collar == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CollarDetail not found"); // Đổi từ BrandDetail sang CollarDetail
        }
        return ResponseEntity.ok(collar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollarResponseDTO> updateCollar(
            @PathVariable Integer id,
            @RequestBody CollarRequestDTO requestDTO) { // Đổi từ BrandRequestDTO sang CollarRequestDTO
        try {
            Collar updatedCollar = collarService.update(id, requestDTO); // Đổi từ brandService sang collarService

            CollarResponseDTO responseDTO = new CollarResponseDTO( // Đổi từ BrandResponseDTO sang CollarResponseDTO
                    updatedCollar.getId(),
                    updatedCollar.getCode(),
                    updatedCollar.getName(),
                    updatedCollar.getDeleted(),
                    updatedCollar.getCreatedDate(),
                    updatedCollar.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollar(@PathVariable Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        try {
            collarService.delete(id); // Đổi từ brandService sang collarService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Collar not found with id: " + id); // Đổi từ Brand sang Collar
        }
    }

    @PostMapping("/save")
    public ResponseEntity<CollarResponseDTO> saveCollar(@RequestBody CollarRequestDTO requestDTO) { // Đổi từ BrandRequestDTO sang CollarRequestDTO
        try {
            Collar collar = collarService.save(requestDTO); // Đổi từ brandService sang collarService

            CollarResponseDTO responseDTO = new CollarResponseDTO( // Đổi từ BrandResponseDTO sang CollarResponseDTO
                    collar.getId(),
                    collar.getCode(),
                    collar.getName(),
                    collar.getDeleted(),
                    collar.getCreatedDate(),
                    collar.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}