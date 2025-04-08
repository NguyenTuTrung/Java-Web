package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ColorRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.ColorResponseDTO;
import org.example.demo.entity.product.properties.Collar;
import org.example.demo.entity.product.properties.Color; // Đổi từ Collar sang Color
import org.example.demo.mapper.product.request.properties.ColorRequestMapper; // Đổi từ CollarRequestMapper sang ColorRequestMapper
import org.example.demo.mapper.product.response.properties.ColorResponseMapper;
import org.example.demo.service.product.properties.ColorService; // Đổi từ CollarService sang ColorService
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
@RequestMapping("color")
public class ColorController {
    @Autowired
    private ColorService colorService; // Đổi từ collarService sang colorService
    @Autowired
    private ColorRequestMapper colorRequestMapper; // Đổi từ collarRequestMapper sang colorRequestMapper
    @Autowired
    private ColorResponseMapper colorResponseMapper; // Đổi từ collarResponseMapper sang colorResponseMapper

    @GetMapping("/color-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(colorService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(colorService.findAll(pageable)); // Đổi từ collarService sang colorService
    }

    @GetMapping("/color-list")
    public ResponseEntity<Map<String, List<Color>>> findAll() {
        List<Color> colors = colorService.findAllList();
        Map<String, List<Color>> response = new HashMap<>();
        response.put("data", colors);
        return ResponseEntity.ok(response);
    }


    @RequestMapping(value = "overview")
    public ResponseEntity<Page<ColorResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(colorService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Color> getColorDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        Color color = colorService.findById(id); // Đổi từ collarService sang colorService
        if (color == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ColorDetail not found"); // Đổi từ CollarDetail sang ColorDetail
        }
        return ResponseEntity.ok(color);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ColorResponseDTO> updateColor(
            @PathVariable Integer id,
            @RequestBody ColorRequestDTO requestDTO) { // Đổi từ CollarRequestDTO sang ColorRequestDTO
        try {
            Color updatedColor = colorService.update(id, requestDTO); // Đổi từ collarService sang colorService

            ColorResponseDTO responseDTO = new ColorResponseDTO( // Đổi từ CollarResponseDTO sang ColorResponseDTO
                    updatedColor.getId(),
                    updatedColor.getCode(),
                    updatedColor.getName(),
                    updatedColor.getDeleted(),
                    updatedColor.getCreatedDate(),
                    updatedColor.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColor(@PathVariable Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        try {
            colorService.delete(id); // Đổi từ collarService sang colorService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Color not found with id: " + id); // Đổi từ Collar sang Color
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ColorResponseDTO> saveColor(@RequestBody ColorRequestDTO requestDTO) { // Đổi từ CollarRequestDTO sang ColorRequestDTO
        try {
            Color color = colorService.save(requestDTO); // Đổi từ collarService sang colorService

            ColorResponseDTO responseDTO = new ColorResponseDTO( // Đổi từ CollarResponseDTO sang ColorResponseDTO
                    color.getId(),
                    color.getCode(),
                    color.getName(),
                    color.getDeleted(),
                    color.getCreatedDate(),
                    color.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}