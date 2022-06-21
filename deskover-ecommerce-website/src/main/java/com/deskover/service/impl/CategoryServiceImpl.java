package com.deskover.service.impl;

import com.deskover.entity.Category;
import com.deskover.entity.Subcategory;
import com.deskover.repository.CategoryRepository;
import com.deskover.repository.datatables.CategoryRepoForDatatables;
import com.deskover.service.CategoryService;
import com.deskover.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryRepository repo;

    @Autowired
    CategoryRepoForDatatables repoForDatatables;

    @Autowired
    SubcategoryService subcategoryService;

    // Check if the slug is already in use by another category
    @Override
    public Boolean existsBySlug(Category category) {
        Category categoryExists = repo.findBySlug(category.getSlug());
        return categoryExists != null && !categoryExists.getId().equals(category.getId());
    }

    @Override
    public List<Category> getByActived(Boolean isActive) {
        return repo.findByActived(isActive);
    }

    @Override
    public DataTablesOutput<Category> getAllForDatatables(DataTablesInput input) {
        DataTablesOutput<Category> categories = repoForDatatables.findAll(input);
        if (categories.getError() != null) {
            throw new IllegalArgumentException(categories.getError());
        }
        return categories;
    }

    @Override
    public Page<Category> getByActived(Boolean isActive, Integer page, Integer size) {
        return repo.findByActived(isActive, PageRequest.of(page, size));
    }

    @Override
    public Category getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Category create(Category category) {
        category.setActived(Boolean.TRUE);
        category.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(category);
    }

    @Override
    @Transactional
    public Category update(Category category) {
        category.setModifiedAt(new Timestamp(System.currentTimeMillis()));
        return repo.save(category);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = this.getById(id);
        if (category == null) {
            throw new IllegalArgumentException("Category not found");
        }
        category.setActived(false);
        category.setDeletedAt(new Timestamp(System.currentTimeMillis()));
        if (repo.save(category).getActived() == Boolean.TRUE) {
            throw new IllegalArgumentException("Category not deleted");
        }

        // Delete all subcategories of this category
        List<Subcategory> subcategories = subcategoryService.getByCategory(id);
        if (subcategories != null) {
            subcategoryService.deleteMultiple(subcategories);
        }
    }

}
