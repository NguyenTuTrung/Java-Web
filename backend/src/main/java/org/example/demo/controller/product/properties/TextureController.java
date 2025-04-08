package org.example.demo.controller.product.properties;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.TextureRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.dto.product.response.properties.TextureResponseDTO;
import org.example.demo.entity.product.properties.Style;
import org.example.demo.entity.product.properties.Texture; // Đổi từ Style sang Texture
import org.example.demo.mapper.product.request.properties.TextureRequestMapper; // Đổi từ StyleRequestMapper sang TextureRequestMapper
import org.example.demo.mapper.product.response.properties.TextureResponseMapper;
import org.example.demo.service.product.properties.TextureService; // Đổi từ StyleService sang TextureService
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
@RequestMapping("texture")
public class TextureController {
    @Autowired
    private TextureService textureService; // Đổi từ styleService sang textureService
    @Autowired
    private TextureRequestMapper textureRequestMapper; // Đổi từ styleRequestMapper sang textureRequestMapper
    @Autowired
    private TextureResponseMapper textureResponseMapper; // Đổi từ styleResponseMapper sang textureResponseMapper

    @GetMapping("/texture-objects")
    public ResponseEntity<?> findAllObjects() {
        return ResponseEntity.ok(textureService.findAllObject());
    }

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(textureService.findAll(pageable)); // Đổi từ styleService sang textureService
    }

    @GetMapping("/texture-list")
    public ResponseEntity<Map<String, List<Texture>>> findAll() {
        List<Texture> textures = textureService.findAllList();
        Map<String, List<Texture>> response = new HashMap<>();
        response.put("data", textures);
        return ResponseEntity.ok(response);
    }



    @RequestMapping(value = "overview")
    public ResponseEntity<Page<TextureResponseDTO>> findAllByPageV3(
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(textureService.findAllOverviewByPage( createdFrom, createdTo, pageableObject));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Texture> getTextureDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Style sang Texture
        Texture texture = textureService.findById(id); // Đổi từ styleService sang textureService
        if (texture == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TextureDetail not found"); // Đổi từ StyleDetail sang TextureDetail
        }
        return ResponseEntity.ok(texture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TextureResponseDTO> updateTexture(
            @PathVariable Integer id,
            @RequestBody TextureRequestDTO requestDTO) { // Đổi từ StyleRequestDTO sang TextureRequestDTO
        try {
            Texture updatedTexture = textureService.update(id, requestDTO); // Đổi từ styleService sang textureService

            TextureResponseDTO responseDTO = new TextureResponseDTO( // Đổi từ StyleResponseDTO sang TextureResponseDTO
                    updatedTexture.getId(),
                    updatedTexture.getCode(),
                    updatedTexture.getName(),
                    updatedTexture.getDeleted(),
                    updatedTexture.getCreatedDate(),
                    updatedTexture.getUpdatedDate()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTexture(@PathVariable Integer id) throws BadRequestException { // Đổi từ Style sang Texture
        try {
            textureService.delete(id); // Đổi từ styleService sang textureService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Texture not found with id: " + id); // Đổi từ Style sang Texture
        }
    }

    @PostMapping("/save")
    public ResponseEntity<TextureResponseDTO> saveTexture(@RequestBody TextureRequestDTO requestDTO) { // Đổi từ StyleRequestDTO sang TextureRequestDTO
        try {
            Texture texture = textureService.save(requestDTO); // Đổi từ styleService sang textureService

            TextureResponseDTO responseDTO = new TextureResponseDTO( // Đổi từ StyleResponseDTO sang TextureResponseDTO
                    texture.getId(),
                    texture.getCode(),
                    texture.getName(),
                    texture.getDeleted(),
                    texture.getCreatedDate(),
                    texture.getUpdatedDate()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}