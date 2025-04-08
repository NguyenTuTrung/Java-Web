package org.example.demo.validator.event;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.event.EventDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.repository.event.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
public class EventValidator {

    @Autowired
    private EventRepository eventRepository;

    public void validateName(String name) throws BadRequestException {
        if (!StringUtils.hasText(name)) {
            throw new BadRequestException("Tên không để trống");
        }
        // Kiểm tra khoảng trắng thừa
        if (!name.trim().equals(name) || name.contains("  ")) {
            throw new BadRequestException("Tên không được chứa khoảng trắng ở đầu, cuối hoặc nhiều khoảng trắng liên tiếp");
        }

        // Kiểm tra trùng lặp
        if (isNameExists(name)) {
            throw new BadRequestException("Tên sự kiện đã tồn tại");
        }
    }

    public boolean isNameExists(String name) {
        return eventRepository.existsByName(name);
    }

}
