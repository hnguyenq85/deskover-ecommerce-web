package com.deskover.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deskover.security.payload.response.MessageResponse;
import com.deskover.entity.Brand;

import com.deskover.service.BrandService;

@RestController
@RequestMapping("v1/api/admin")
public class BrandApi {

	@Autowired
	BrandService service;

	/**
	 * Get All brand
	 * @return List<Brand>
	 */
	@GetMapping("/brand/getall")
	public ResponseEntity<?> doGetAll() {
		List<Brand> listBrand = service.getAll();
		return ResponseEntity.ok(listBrand);
	}

	/**
	 * Get All brand Actived
	 * @return List<Brand>
	 */
	@GetMapping("/brand/getallbrandactived")
	public ResponseEntity<?> doGetAllBrandIsActived() {
		List<Brand> listBrand = service.getAllBrandIsActived();
		if (listBrand == null) {
			return ResponseEntity.ok(new MessageResponse("Không có brand nào đang hoạt động"));
		}
		return ResponseEntity.ok(listBrand);
	}

	/**
	 * Get brand By Id
	 * @param Long id
	 * @return Brand
	 */
	@GetMapping("/brand/{id}")
	public ResponseEntity<?> doGetById(@PathVariable("id") Long id) {
		Brand brand = service.get(id);
		if (brand == null) {
			return ResponseEntity.ok(new MessageResponse("Không tìm thấy brand có id: " + id));
		}
		return ResponseEntity.ok(brand);
	}

	/**
	 * Get brand By Slug
	 * @param String slug
	 * @return Brand
	 */
	@GetMapping("/brand/{slug}")
	public ResponseEntity<?> doGetBySlug(@PathVariable("slug") String slug) {
		Brand brand = service.get(slug);
		if (brand == null) {
			return ResponseEntity.ok(new MessageResponse("Không tìm thấy brand có slug: " + slug));
		}
		return ResponseEntity.ok(brand);
	}

	/**
	 * Create brand
	 * @param Brand brand
	 * @return Brand
	 */
	@PostMapping("/brand/create")
	public ResponseEntity<?> doCreate(@RequestBody Brand brand){
		try {
			service.create(brand);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
	}
	
	/**
	 * Create brand
	 * @param Long id
	 * @return brand
	 */
	@PutMapping("/brand/delete/{id}")
	public ResponseEntity<?> doDelete(@PathVariable("id") Long id){
		try {
			service.delete(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
	}
}
