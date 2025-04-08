package org.example.demo.infrastructure.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSessionImpl implements UserSession{

    @Autowired
    private  HttpSession httpSession;

    @Override
    public UserDetailToken getEmployee() {
        return (UserDetailToken) httpSession.getAttribute("employee");
    }

    @Override
    public UserDetailToken getCustomer() {
        return (UserDetailToken) httpSession.getAttribute("employee");
    }
}
