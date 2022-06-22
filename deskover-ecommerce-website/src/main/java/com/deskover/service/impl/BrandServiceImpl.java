package com.deskover.service.impl;

import com.deskover.entity.Brand;
import com.deskover.entity.Category;
import com.deskover.repository.BrandRepository;
import com.deskover.repository.datatables.BrandRepoForDatatables;
import com.deskover.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    BrandRepository repo;

    @Autowired
    BrandRepoForDatatables repoForDatatables;

    @Override
    public List<Brand> getAll() {
        // TODO Auto-generated method stub
        return repo.findAll();
    }

    @Override
    public List<Brand> getAllBrandIsActived() {
        // TODO Auto-generated method stub
        return repo.findByActived(Boolean.TRUE);
    }

    @Override
    public Brand getById(Long id) {
        // TODO Auto-generated method stub
        return repo.findById(id).orElse(null);
    }

    @Override
    public Brand getBySlug(String slug) {
        // TODO Auto-generated method stub
        return repo.findBySlug(slug);
    }

    @Override
    public Boolean existsBySlug(String slug) {
        // TODO Auto-generated method stub
        return repo.existsBySlug(slug);
    }

    @Override
    @Transactional
    public Brand create(Brand brand) {
        // TODO Auto-generated method stub
        if (repo.existsBySlug(brand.getSlug())) {
            return null;
        }
        brand.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        brand.setModifiedAt(null);
        brand.setDeletedAt(null);
        brand.setActived(Boolean.TRUE);
        return repo.save(brand);
    }

    @Override
    @Transactional
    public Brand update(Long id, Brand brand) {
        // TODO Auto-generated method stub
        Brand updateBrand = repo.getById(id);
        updateBrand.setName(brand.getName());
        updateBrand.setDescription(brand.getDescription());
        if (brand.getSlug() != null && repo.getById(id).getSlug() != brand.getSlug()) {
            if (repo.existsBySlug(brand.getSlug())) {
                return null;
            }
        }
        updateBrand.setSlug(brand.getSlug());
        updateBrand.setCreatedAt(brand.getCreatedAt());
        updateBrand.setModifiedAt(new Timestamp(System.currentTimeMillis()));
        updateBrand.setDeletedAt(null);
        updateBrand.setActived(brand.getActived());
        return repo.saveAndFlush(updateBrand);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        // TODO Auto-generated method stub
        Brand deleteBrand = repo.getById(id);
        deleteBrand.setDeletedAt(new Timestamp((System.currentTimeMillis())));
        deleteBrand.setActived(Boolean.FALSE);
        repo.saveAndFlush(deleteBrand);
    }

    @Override
    public DataTablesOutput<Brand> getAllForDatatables(DataTablesInput input) {
        DataTablesOutput<Brand> brand = repoForDatatables.findAll(input);
        if (brand.getError() != null) {
            throw new IllegalArgumentException(brand.getError());
        }
        return brand;
    }

}
