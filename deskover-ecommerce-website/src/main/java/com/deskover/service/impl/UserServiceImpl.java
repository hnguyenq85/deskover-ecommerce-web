package com.deskover.service.impl;

import com.deskover.entity.User;
import com.deskover.repository.UserRepository;
import com.deskover.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository repo;

    @Override
    public User getByUsername(String username) {
        return repo.findByUsername(username);
    }
}
