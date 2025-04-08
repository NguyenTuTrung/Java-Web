package org.example.demo.controller.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@RestController
@RequestMapping("/api/orders")
@Slf4j
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send")
    @SendTo("/send/messages")
    public ResponseEntity<?> sendMessage(String message, StompHeaderAccessor headerAccessor) {
        log.info("WS MESSAGE: " + message);
        return ResponseEntity.ok(message);
    }

    @MessageMapping("/receive")
    @SendTo("/receive/messages")
    public ResponseEntity<?> getMessage(StompHeaderAccessor headerAccessor) {
        log.info("Có thông báo mới");
        return ResponseEntity.ok("Có thông báo mới");
    }

    @MessageMapping("/new-order")
    @SendTo("/new-order/messages")
    public ResponseEntity<?> getNewOrder(StompHeaderAccessor headerAccessor) {
        return ResponseEntity.ok("Có thông báo mới");
    }

    @EventListener
    public void handleSessionConnectEvent(SessionConnectEvent event) {
        System.out.println("Session Connect Event");
    }

    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        System.out.println("Session Disconnect Event");
    }
}

