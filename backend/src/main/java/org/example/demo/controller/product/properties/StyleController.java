package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.StyleRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.entity.product.properties.Style; // Đổi từ updatedStyle sang Style
import org.example.demo.mapper.product.request.properties.StyleRequestMapper; // Đổi từ SleeveRequestMapper sang StyleRequestMapper
import org.example.demo.mapper.product.response.properties.StyleResponseMapper;
import org.example.demo.service.product.properties.StyleService; // Đổi từ SleeveService sang StyleService
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
@RequestMapping("style")
public class StyleController {
    @Autowired
    private StyleService styleService; // Đổi từ sleeveService sang styleService
    @Autowired
    private StyleRequestMapper styleRequestMapper; // Đổi từ sleeveRequestMapper sang styleRequestMapper
    @Autowired
    private StyleResponseMapper styleResponseMapper; // Đổi từ sleeveResponseMapper sang styleResponseMapper

    @GetMapping("/style-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(styleService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(styleService.findAll(pageable)); // Đổi từ sleeveService sang styleService
    }

    @GetMapping("/style-list")
    public ResponseEntity<Map<String, List<Style>>> findAll() {
        List<Style> styles = styleService.findAllList();
        Map<String, List<Style>> response = new HashMap<>();
        response.put("data", styles);
        return ResponseEntity.ok(response);
    }


    @RequestMapping(value = "overview")
    public ResponseEntity<Page<StyleResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(styleService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Style> getStyleDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ updatedStyle sang Style
        Style style = styleService.findById(id); // Đổi từ sleeveService sang styleService
        if (style == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "StyleDetail not found"); // Đổi từ SleeveDetail sang StyleDetail
        }
        return ResponseEntity.ok(style);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StyleResponseDTO> updateStyle(
            @PathVariable Integer id,
            @RequestBody StyleRequestDTO requestDTO) { // Đổi từ SleeveRequestDTO sang StyleRequestDTO
        try {
            Style updatedStyle = styleService.update(id, requestDTO); // Đổi từ sleeveService sang styleService

            StyleResponseDTO responseDTO = new StyleResponseDTO( // Đổi từ SleeveResponseDTO sang StyleResponseDTO
                    updatedStyle.getId(),
                    updatedStyle.getCode(),
                    updatedStyle.getName(),
                    updatedStyle.getDeleted(),
                    updatedStyle.getCreatedDate(),
                    updatedStyle.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStyle(@PathVariable Integer id) throws BadRequestException { // Đổi từ updatedStyle sang Style
        try {
            styleService.delete(id); // Đổi từ sleeveService sang styleService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Style not found with id: " + id); // Đổi từ updatedStyle sang Style
        }
    }

    @PostMapping("/save")
    public ResponseEntity<StyleResponseDTO> saveStyle(@RequestBody StyleRequestDTO requestDTO) { // Đổi từ SleeveRequestDTO sang StyleRequestDTO
        try {
            Style style = styleService.save(requestDTO); // Đổi từ sleeveService sang styleService

            StyleResponseDTO responseDTO = new StyleResponseDTO( // Đổi từ SleeveResponseDTO sang StyleResponseDTO
                    style.getId(),
                    style.getCode(),
                    style.getName(),
                    style.getDeleted(),
                    style.getCreatedDate(),
                    style.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}