package com.deskover.api.app;

import com.deskover.configuration.security.payload.response.MessageErrorUtil;
import com.deskover.configuration.security.payload.response.MessageResponse;
import com.deskover.entity.UserAddress;
import com.deskover.service.UserAddressService;
import com.deskover.util.ValidationUtil;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController("UserApiForClient")
@RequestMapping("v1/api/custumer")
public class UserApi {
	@Autowired
	private UserAddressService contactService;

	@GetMapping("/user/address")
	public ResponseEntity<?> doGetAddress(@RequestParam("username") String username) {
		try {
			return ResponseEntity.ok(contactService.findByUsername(username));
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}
	
	@PostMapping("/user/address")
	public ResponseEntity<?> doPostAddress(@Valid @RequestBody UserAddress userAddress, BindingResult result, @RequestParam("username") String username){
		if (result.hasErrors()) {
            MessageResponse errors = ValidationUtil.ConvertValidationErrors(result);
            return ResponseEntity.badRequest().body(errors);
        }
		try {
			contactService.doPostAddAddress(userAddress, username);
			return ResponseEntity.ok(new MessageResponse("Thêm mới thành công"));
		} catch (Exception e) {
            MessageResponse error = MessageErrorUtil.message("Thêm mới thất bại", e);
            return ResponseEntity.badRequest().body(error);
		}
	}
	
	@PutMapping("/user/address/{id}")
	public ResponseEntity<?> changeActive(@PathVariable("id") Long id, @RequestParam("username") String username) {
		try {
			contactService.changeActive(id, username);
			return ResponseEntity.ok(contactService.findByUsername(username));
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}
	
	@PutMapping("/user/address-choose/{id}")
	public ResponseEntity<?> changeChoose(@PathVariable("id") Long id, @RequestParam("username") String username){
		try {
			contactService.changeChoose(id, username);
			return ResponseEntity.ok(new MessageResponse("Thay đổi thành công"));
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(),e);
		}
	}
	
}
