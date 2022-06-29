package com.deskover.api.admin;

import com.deskover.configuration.security.payload.response.MessageResponse;
import com.deskover.dto.AdminCreateDto;
import com.deskover.dto.AdministratorDto;
import com.deskover.service.AdminAuthorityService;
import com.deskover.service.AdminPasswordService;
import com.deskover.service.AdminService;
import com.deskover.util.ValidationUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("v1/api/admin")
public class AdministratorApi {
    @Autowired
    AdminService adminService;

    @Autowired
    AdminPasswordService adminPasswordService;

    @Autowired
    AdminAuthorityService adminAuthorityService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/administrator/{id}")
    public ResponseEntity<?> doGetProfile(@PathVariable("id") Long id) {
        AdministratorDto admin = mapper.map(adminService.getById(id), AdministratorDto.class);
        if (admin == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Administrator not found"));
        }
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/administrator")
    public ResponseEntity<?> doCreate(@Valid @RequestBody AdminCreateDto admin, BindingResult result) {
        if (result.hasErrors()) {
            MessageResponse errors = ValidationUtil.ConvertValidationErrors(result);
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            AdministratorDto adminCreated = mapper.map(adminService.create(admin),AdministratorDto.class);
            return ResponseEntity.ok().body(adminCreated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/administrator")
    public ResponseEntity<?> doUpdate(@Valid @RequestBody AdministratorDto admin, BindingResult result) {
    	if (result.hasErrors()) {
            MessageResponse errors = ValidationUtil.ConvertValidationErrors(result);
            return ResponseEntity.badRequest().body(errors);
        }
    	try {
			AdministratorDto adminUpdated = adminService.update(admin);
			return ResponseEntity.ok().body(adminUpdated);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
    }
//    @GetMapping("/{id}")
//    public ResponseEntity<?> doGetProfile(@PathVariable("id") Long id) {
//        AdministratorDto admin = mapper.map(adminService.getById(id), AdministratorDto.class);
//        if (admin == null) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Administrator Not Found"));
//        }
//        admin.setPassword(mapper.map(adminPasswordService.getById(admin.getId()),AdminPasswordDto.class));
//        admin.setAuthorities(adminAuthorityService.getByAdminId(admin.getId()));
//        return ResponseEntity.ok(admin);
//    }

}
