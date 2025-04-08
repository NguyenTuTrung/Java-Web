package org.example.demo.entity.human.role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "role", uniqueConstraints = @UniqueConstraint(columnNames = {"code"}))
public class Role extends BaseEntity {

    @Column(name = "code")
    private String code;

    // Hung : Add Column name to Entity 14/10/2024
    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name;

    public static String ADMIN = "ADMIN";
    public static String USER = "USER";
    public static String CUSTOMER = "CUSTOMER";
    public static String STAFF = "STAFF";
}
