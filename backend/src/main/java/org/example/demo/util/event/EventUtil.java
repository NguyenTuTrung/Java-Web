package org.example.demo.util.event;

import org.example.demo.entity.event.Event;

import java.util.List;

public class EventUtil {
    public static double getAveragePercentEvent(List<Event> validEvents) {
        return roundPercent(
                validEvents.stream()
                        .mapToInt(Event::getDiscountPercent)
                        .average()
                        .orElse(0.0)
        );
    }
    public static double roundPercent(double percent){
        return Math.round(percent * 100) / 100.0;
    }
}
