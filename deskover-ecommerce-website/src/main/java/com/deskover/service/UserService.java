package com.deskover.service;

import com.deskover.entity.User;

public interface UserService {
    User getByUsername(String username);
}
