package org.example.demo.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

@Slf4j
public class FileUploadUtil {

    public static final Path root = Paths.get("uploads");
    public static final Path rootProductQR = Paths.get("uploads/qr/product");


    public static String saveProductQR(String fileName, BufferedImage bufferedImage) throws IOException {

        // Create the directory if it doesn't exist
        if (!Files.exists(rootProductQR)) {
            Files.createDirectories(rootProductQR);
            log.info("Thư mục đã được tạo thành công.");
        }

        try {
            // Generate a unique name for the image file
            String nameFile = UUID.randomUUID().toString() + ".png";
            File file = rootProductQR.resolve(nameFile).toFile();

            // Save the BufferedImage as a PNG file
            ImageIO.write(bufferedImage, "PNG", file);
            log.info("Lưu ảnh {} thành công", nameFile);

            return nameFile;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            throw new RuntimeException("Error saving the image: " + e.getMessage(), e);
        }
    }


    public static String saveFile(String fileName, MultipartFile multipartFile) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
            log.info("Tạo thư muc thành công");
        }
        try {
            String nameFile = UUID.randomUUID().toString() + ".png";
            Files.copy(multipartFile.getInputStream(), root.resolve(nameFile));
            log.info("Lưu {} ảnh thành công", fileName);
            return nameFile;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            throw new RuntimeException(e.getMessage());
        }
    }

    public static File getFile(String fileName) {
        Path filePath = root.resolve(fileName);
        File file = filePath.toFile();

        if (!file.exists()) {
            throw new RuntimeException("File not found.");
        }

        return file;
    }



}