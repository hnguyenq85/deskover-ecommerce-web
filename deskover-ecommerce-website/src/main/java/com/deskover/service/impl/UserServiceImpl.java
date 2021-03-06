package com.deskover.service.impl;

import java.sql.Timestamp;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.deskover.dto.ChangePasswordDto;
import com.deskover.dto.UserCreateDto;
import com.deskover.entity.Users;
import com.deskover.repository.UserRepository;
import com.deskover.repository.datatables.UserRepoForDatatables;
import com.deskover.service.UserPasswordService;
import com.deskover.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	private BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
	
	@Autowired
	UserRepository repo;
	
	@Autowired
	UserRepoForDatatables repoForDatatables;
	
	@Autowired
	UserPasswordService userPasswordService;

	@Override
	@Transactional
	public void changeActived(Long id) {
		Users user = repo.findById(id).orElse(null);
		if(user == null) {
			throw new IllegalArgumentException("Không tìm thấy user");
		}
		user.setActived(!user.getActived());
		user.setModifiedAt(new Timestamp(System.currentTimeMillis()));
		user.setModifiedBy(SecurityContextHolder.getContext().getAuthentication().getName());
		repo.saveAndFlush(user);
	}

	@Override
	public DataTablesOutput<Users> getByActiveForDatatables(DataTablesInput input, Boolean isActive) {
		DataTablesOutput<Users> Users = repoForDatatables.findAll(input,
				(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("actived"), isActive));
		if (Users.getError() != null) {
			throw new IllegalArgumentException(Users.getError());
		}
		return Users;
	}

	@Override
	public Users findById(Long id) {
		return repo.getById(id);
	}

	@Override
	public Users findByUsername(String username) {
		return repo.findByUsername(username);
	}

	@Override
	public Users create(UserCreateDto userRequest) {
		if(repo.existsByUsername(userRequest.getUsername())) {
			throw new IllegalArgumentException("Username này đã tồn tại vui lòng nhập username khác");
		}
		if(!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
			throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
		}else {
			Users createUser = new Users();
			createUser.setUsername(userRequest.getUsername());
			createUser.setFullname(userRequest.getFullname());
			createUser.setAvatar(null);
			createUser.setLastLogin(null);
			createUser.setActived(Boolean.FALSE);
			createUser.setVerify(Boolean.FALSE);
			createUser.setModifiedAt(new Timestamp(System.currentTimeMillis()));
			createUser.setModifiedBy(null);
			Users createdUser = repo.save(createUser);
			
			userPasswordService.create(createdUser, userRequest.getConfirmPassword());
			
			return createdUser;
		}
	}

	@Override
	public void updatePassword(ChangePasswordDto userRequest) {
		userPasswordService.updatePassword(SecurityContextHolder.getContextHolderStrategy().getContext().getAuthentication().getName(), userRequest);
	}

}
