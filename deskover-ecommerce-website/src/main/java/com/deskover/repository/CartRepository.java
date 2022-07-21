package com.deskover.repository;

import com.deskover.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
	Cart  findByProductIdAndUserId(Long productId, Long userId);
}