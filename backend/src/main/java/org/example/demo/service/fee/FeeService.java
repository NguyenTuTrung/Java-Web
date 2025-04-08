package org.example.demo.service.fee;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.demo.dto.ghn.FeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class FeeService {

    @Autowired
    private ObjectMapper objectMapper;

    public JsonNode calculator(String url, FeeDTO feeDTO) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        String requestBody = objectMapper.writeValueAsString(feeDTO);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Token", "718f2008-46b7-11ef-b4a4-2ec170e33d11")
                .header("ShopId", "5209498")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to call API: " + response.statusCode() + " - " + response.body());
        }

        // Chuyển đổi chuỗi JSON thành JsonNode
        return objectMapper.readTree(response.body());
    }
}
