package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.SizeRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.entity.product.properties.Origin;
import org.example.demo.entity.product.properties.Size; // Đổi từ Origin sang Size
import org.example.demo.mapper.product.request.properties.SizeRequestMapper; // Đổi từ OriginRequestMapper sang SizeRequestMapper
import org.example.demo.mapper.product.response.properties.SizeResponseMapper;
import org.example.demo.service.product.properties.SizeService; // Đổi từ OriginService sang SizeService
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
@RequestMapping("size")
public class SizeController {
    @Autowired
    private SizeService sizeService; // Đổi từ originService sang sizeService
    @Autowired
    private SizeRequestMapper sizeRequestMapper; // Đổi từ originRequestMapper sang sizeRequestMapper
    @Autowired
    private SizeResponseMapper sizeResponseMapper; // Đổi từ originResponseMapper sang sizeResponseMapper

    @GetMapping("/size-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(sizeService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(sizeService.findAll(pageable)); // Đổi từ originService sang sizeService
    }

    @GetMapping("/size-list")
    public ResponseEntity<Map<String, List<Size>>> findAll() {
        List<Size> sizes = sizeService.findAllList();
        Map<String, List<Size>> response = new HashMap<>();
        response.put("data", sizes);
        return ResponseEntity.ok(response);
    }





    @RequestMapping(value = "overview")
    public ResponseEntity<Page<SizeResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(sizeService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Size> getSizeDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        Size size = sizeService.findById(id); // Đổi từ originService sang sizeService
        if (size == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SizeDetail not found"); // Đổi từ OriginDetail sang SizeDetail
        }
        return ResponseEntity.ok(size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SizeResponseDTO> updateSize(
            @PathVariable Integer id,
            @RequestBody SizeRequestDTO requestDTO) { // Đổi từ OriginRequestDTO sang SizeRequestDTO
        try {
            Size updatedSize = sizeService.update(id, requestDTO); // Đổi từ originService sang sizeService

            SizeResponseDTO responseDTO = new SizeResponseDTO( // Đổi từ OriginResponseDTO sang SizeResponseDTO
                    updatedSize.getId(),
                    updatedSize.getCode(),
                    updatedSize.getName(),
                    updatedSize.getDeleted(),
                    updatedSize.getCreatedDate(),
                    updatedSize.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSize(@PathVariable Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        try {
            sizeService.delete(id); // Đổi từ originService sang sizeService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Size not found with id: " + id); // Đổi từ Origin sang Size
        }
    }

    @PostMapping("/save")
    public ResponseEntity<SizeResponseDTO> saveSize(@RequestBody SizeRequestDTO requestDTO) { // Đổi từ OriginRequestDTO sang SizeRequestDTO
        try {
            Size size = sizeService.save(requestDTO); // Đổi từ originService sang sizeService

            SizeResponseDTO responseDTO = new SizeResponseDTO( // Đổi từ OriginResponseDTO sang SizeResponseDTO
                    size.getId(),
                    size.getCode(),
                    size.getName(),
                    size.getDeleted(),
                    size.getCreatedDate(),
                    size.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}