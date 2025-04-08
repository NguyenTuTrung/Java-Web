package org.example.demo.service.history;

import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.properties.History;
import org.example.demo.entity.security.Account;
import org.example.demo.repository.history.HistoryRepository;
import org.example.demo.util.auth.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoryService {
    @Autowired
    private HistoryRepository historyRepository;

    public History createNewHistoryObject(Order order, Status status, String note){
        Account account = AuthUtil.getAccount();
        History history = new History();
        history.setStatus(status);
        history.setNote(note);
        history.setOrder(order);
        history.setAccount(account);
        return historyRepository.save(history);
    }
}
