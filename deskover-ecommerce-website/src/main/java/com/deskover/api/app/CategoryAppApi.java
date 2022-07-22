package com.deskover.api.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deskover.entity.Category;
import com.deskover.service.CategoryService;

@RestController
@RequestMapping("v1/api/custumer")
public class CategoryAppApi {
	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/display-category")
	public ResponseEntity<?> doGetAll(){
		List<Category> category =  categoryService.getByActived(Boolean.TRUE);
		return ResponseEntity.ok(category);
	}

}