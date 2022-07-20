package com.deskover.repository.datatables;

import org.springframework.data.jpa.datatables.repository.DataTablesRepository;

import com.deskover.entity.User;

public interface UserRepoForDatatables extends DataTablesRepository<User, Long>{


}