package org.example.demo.dto.history.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.auth.response.AccountResponseDTO;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.security.Account;

import java.time.LocalDateTime;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoryResponseDTO {
    private Integer id;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String note;
    private AccountResponseDTO account;
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime updatedDate;
}
