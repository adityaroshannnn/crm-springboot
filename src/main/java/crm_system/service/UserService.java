package crm_system.service;

import crm_system.entity.User;

public interface UserService {
    User registerUser(String username, String password);
    User findByUsername(String username);
}