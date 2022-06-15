package com.deskover.repository;

import com.deskover.entity.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	List<Product> findByActived(Boolean actived);
}