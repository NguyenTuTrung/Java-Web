package org.example.demo.entity.order.properties;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.security.Account;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "history")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "note", columnDefinition = "NVARCHAR(255)")
    private String note;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "order_id")
    private Order order;

    @CreationTimestamp
    @JsonFormat(pattern = "dd-MM-yyyy hh-mm-ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @JsonFormat(pattern = "dd-MM-yyyy hh-mm-ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime updatedDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

}
