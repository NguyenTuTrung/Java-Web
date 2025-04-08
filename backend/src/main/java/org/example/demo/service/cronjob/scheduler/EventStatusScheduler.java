package org.example.demo.service.cronjob.scheduler;

import jakarta.transaction.Transactional;
import org.example.demo.entity.event.Event;
import org.example.demo.repository.event.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EventStatusScheduler {

    @Autowired
    private EventRepository eventRepository;

    // Cron job này chạy mỗi giờ một lần
    @Scheduled(cron = "0 0 * * * *") // Chạy vào phút 0 của mỗi giờ
    @Transactional
    public void updateEventStatuses() {
        // Lấy tất cả các sự kiện từ cơ sở dữ liệu
        List<Event> events = eventRepository.findAll();

        // Cập nhật trạng thái cho từng sự kiện
        for (Event event : events) {
            event.updateStatusBasedOnTime();
        }

        // Lưu tất cả các sự kiện đã cập nhật
        eventRepository.saveAll(events);

    }
}
