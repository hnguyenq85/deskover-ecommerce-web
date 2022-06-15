package com.deskover.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deskover.configuration.security.payload.response.MessageResponse;
import com.deskover.entity.Product;
import com.deskover.service.impl.ProductService;

@RestController
@RequestMapping("v1/api/admin")
public class ProductApi {
	
	@Autowired
	private ProductService productService;
	
	@GetMapping("/products/actived")
	public ResponseEntity<?> doGetAll(){
		List<Product> products = productService.findByActived(Boolean.TRUE);
		if (products.isEmpty()) {
			return ResponseEntity.badRequest().body(new MessageResponse("Products Not Found"));
		}
		return ResponseEntity.ok(products);
		
	}
	
	@GetMapping("/products/unactived")
	public ResponseEntity<?> doGetUnActived(){
		List<Product> products = productService.findByActived(Boolean.FALSE);
		if (products.isEmpty()) {
			return ResponseEntity.badRequest().body(new MessageResponse("Products UnActive Not Found"));
		}
		return ResponseEntity.ok(products);
	}
	
	@PostMapping("/products")
	public ResponseEntity<?> doPostCreate(){
		return null;
		
	}
   
}
