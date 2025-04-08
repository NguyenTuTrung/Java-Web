package org.example.demo.infrastructure.common;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AutoGenCode {
    public String genarateUniqueCode() {
        String uuidPart = UUID.randomUUID().toString().split("-")[0];
        return "HC-" + uuidPart;
    }
}
