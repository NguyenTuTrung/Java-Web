package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.SleeveRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.SleeveResponseDTO;
import org.example.demo.entity.product.properties.Size;
import org.example.demo.entity.product.properties.Sleeve; // Đổi từ Size sang Sleeve
import org.example.demo.mapper.product.request.properties.SleeveRequestMapper; // Đổi từ SizeRequestMapper sang SleeveRequestMapper
import org.example.demo.mapper.product.response.properties.SleeveResponseMapper;
import org.example.demo.service.product.properties.SleeveService; // Đổi từ SizeService sang SleeveService
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
@RequestMapping("sleeve")
public class SleeveController {
    @Autowired
    private SleeveService sleeveService; // Đổi từ sizeService sang sleeveService
    @Autowired
    private SleeveRequestMapper sleeveRequestMapper; // Đổi từ sizeRequestMapper sang sleeveRequestMapper
    @Autowired
    private SleeveResponseMapper sleeveResponseMapper; // Đổi từ sizeResponseMapper sang sleeveResponseMapper

    @GetMapping("/sleeve-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(sleeveService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(sleeveService.findAll(pageable)); // Đổi từ sizeService sang sleeveService
    }

    @GetMapping("/sleeve-list")
    public ResponseEntity<Map<String, List<Sleeve>>> findAll() {
        List<Sleeve> sleeves = sleeveService.findAllList();
        Map<String, List<Sleeve>> response = new HashMap<>();
        response.put("data", sleeves);
        return ResponseEntity.ok(response);
    }



    @RequestMapping(value = "overview")
    public ResponseEntity<Page<SleeveResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(sleeveService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Sleeve> getSleeveDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Size sang Sleeve
        Sleeve sleeve = sleeveService.findById(id); // Đổi từ sizeService sang sleeveService
        if (sleeve == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SleeveDetail not found"); // Đổi từ SizeDetail sang SleeveDetail
        }
        return ResponseEntity.ok(sleeve);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SleeveResponseDTO> updateSleeve(
            @PathVariable Integer id,
            @RequestBody SleeveRequestDTO requestDTO) { // Đổi từ SizeRequestDTO sang SleeveRequestDTO
        try {
            Sleeve updatedSleeve = sleeveService.update(id, requestDTO); // Đổi từ sizeService sang sleeveService

            SleeveResponseDTO responseDTO = new SleeveResponseDTO( // Đổi từ SizeResponseDTO sang SleeveResponseDTO
                    updatedSleeve.getId(),
                    updatedSleeve.getCode(),
                    updatedSleeve.getName(),
                    updatedSleeve.getDeleted(),
                    updatedSleeve.getCreatedDate(),
                    updatedSleeve.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSleeve(@PathVariable Integer id) throws BadRequestException { // Đổi từ Size sang Sleeve
        try {
            sleeveService.delete(id); // Đổi từ sizeService sang sleeveService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Sleeve not found with id: " + id); // Đổi từ Size sang Sleeve
        }
    }

    @PostMapping("/save")
    public ResponseEntity<SleeveResponseDTO> saveSleeve(@RequestBody SleeveRequestDTO requestDTO) { // Đổi từ SizeRequestDTO sang SleeveRequestDTO
        try {
            Sleeve sleeve = sleeveService.save(requestDTO); // Đổi từ sizeService sang sleeveService

            SleeveResponseDTO responseDTO = new SleeveResponseDTO( // Đổi từ SizeResponseDTO sang SleeveResponseDTO
                    sleeve.getId(),
                    sleeve.getCode(),
                    sleeve.getName(),
                    sleeve.getDeleted(),
                    sleeve.getCreatedDate(),
                    sleeve.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}