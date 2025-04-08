package org.example.demo.util.auth;

import org.example.demo.entity.human.role.Role;
import org.example.demo.entity.security.Account;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {
    public static Account getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof Account) {
                return (Account) principal;
            }
        }
        return null;
    }
    public static boolean hasRole(String role_code) {
        Account account = getAccount();
        if(account != null){
            Role role = account.getRole();
            if(role != null){
                String roleCode = role.getCode();
                return roleCode.equalsIgnoreCase(role_code);
            }
        }
        return false;
    }

}
