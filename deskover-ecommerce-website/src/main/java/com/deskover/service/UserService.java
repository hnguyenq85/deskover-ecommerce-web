package com.deskover.service;

import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;

import com.deskover.entity.User;

public interface UserService {
	 void changeActive(Long id);
	 DataTablesOutput<User> getByActiveForDatatables(DataTablesInput input, Boolean isActive);
}
