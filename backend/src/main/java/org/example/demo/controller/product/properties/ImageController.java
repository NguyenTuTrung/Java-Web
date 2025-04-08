package org.example.demo.controller.product.properties;

// Đổi từ Elasticity sang Image

import org.example.demo.mapper.product.request.properties.ImageRequestMapper; // Đổi từ ElasticityRequestMapper sang ImageRequestMapper
import org.example.demo.mapper.product.response.properties.ImageResponseMapper;
import org.example.demo.service.product.properties.ImageService; // Đổi từ ElasticityService sang ImageService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("image")
public class ImageController {
    @Autowired
    private ImageService imageService; // Đổi từ elasticityService sang imageService
    @Autowired
    private ImageRequestMapper imageRequestMapper;
    @Autowired
    private ImageResponseMapper imageResponseMapper;



    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }


}