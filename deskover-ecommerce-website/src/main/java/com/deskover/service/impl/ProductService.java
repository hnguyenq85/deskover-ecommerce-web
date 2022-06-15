package com.deskover.service.impl;

import java.util.List;

import com.deskover.entity.Product;

public interface ProductService{
	List<Product> findByActived(Boolean actived);
}
