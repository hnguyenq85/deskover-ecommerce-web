package com.deskover.service;

import com.deskover.dto.CategoryDto;
import com.deskover.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

public interface CategoryService {
	List<Category> getByActived(Boolean isActive);

    DataTablesOutput<CategoryDto> getAllForDatatables(DataTablesInput input);

    Page<Category> getByActived(Boolean isActive, Integer page, Integer size);

	Category getById(Long id);

	Category update(Category category);

	void delete(Long id);
}
