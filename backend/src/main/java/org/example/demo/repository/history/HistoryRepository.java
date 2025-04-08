package org.example.demo.repository.history;

import org.example.demo.entity.order.properties.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Integer> {
    List<History> findAllByOrderId(Integer integer);
}
