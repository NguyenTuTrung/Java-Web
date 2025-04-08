package org.example.demo.repository.security;

import org.example.demo.entity.human.role.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByCode(String code);

    Optional<Object> findByName(String name);
}
