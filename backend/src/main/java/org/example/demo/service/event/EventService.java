package org.example.demo.service.event;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.repository.product.properties.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Date;

public interface EventService {

    Page<EventListDTO> filterDate(LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<EventListDTO> filterStatus(String status, Pageable pageable);

    Page<EventListDTO> search(String search, Pageable pageable);

    Page<EventListDTO> getEvents(Pageable pageable);

    EventDTO getById(Integer id);

    EventDTO saveEvent(EventDTO eventDTO) throws BadRequestException;

    EventDTO updateEvent(Integer id, EventDTO eventDTO);

    void deleteEvent(Integer id);

    boolean isNameCheck(String name);

}
