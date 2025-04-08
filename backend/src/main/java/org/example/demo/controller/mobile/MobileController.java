package org.example.demo.controller.mobile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RestController
@RequestMapping("/api/mobile")
public class MobileController {

    @MessageMapping("/has-change-order")
    @SendTo("/has-change/messages")
    public String sendMessage(String message) {
        log.info("WebSocket message received 1: " + message);
        return message; // Gửi tin nhắn tới tất cả các client đang subscribe
    }

    @MessageMapping("/change-order-in-store-coder")
    @SendTo("/has-change-order-in-store-coder/messages")
    public String sendMessage2(String message) {
        log.info("WebSocket message received 2: " + message);
        return message; // Gửi tin nhắn tới tất cả các client đang subscribe
    }

    @EventListener
    public void handleSessionConnectEvent(SessionConnectEvent event) {
        log.info("Session MOBILE Connect Event");
    }

    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        log.info("Session MOBILE Disconnect Event");
    }
}
