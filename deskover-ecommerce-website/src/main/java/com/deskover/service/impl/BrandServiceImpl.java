package com.deskover.service.impl;

import com.deskover.entity.Brand;
import com.deskover.entity.Category;
import com.deskover.repository.BrandRepository;
import com.deskover.repository.datatables.BrandRepoForDatatables;
import com.deskover.service.BrandService;
import org.aspectj.bridge.Message;
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
        return repo.findAll();
    }

    @Override
    public List<Brand> getAllBrandIsActived() {
        return repo.findByActived(Boolean.TRUE);
    }

    @Override
    public Brand getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public Brand getBySlug(String slug) {
        return repo.findBySlug(slug);
    }

    @Override
    public Boolean existsBySlug(String slug) {
        return repo.existsBySlug(slug);
    }

    @Override
    @Transactional
    public Brand create(Brand brand) {
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
        Brand updateBrand = repo.findById(id).orElse(null);
        if(updateBrand == null){
            return null;
        }
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
        Brand deleteBrand = repo.findById(id).orElse(null);
        if(deleteBrand == null){
            throw new IllegalArgumentException("Brand này không tồn tại");
        }
        deleteBrand.setDeletedAt(new Timestamp((System.currentTimeMillis())));
        deleteBrand.setActived(Boolean.FALSE);
        repo.saveAndFlush(deleteBrand);
    }

    @Override
    public void changeActived(Long id) {
        Brand currentBrand = repo.findById(id).orElse(null);
        if(currentBrand == null){
            throw new IllegalArgumentException("Brand này không tồn tại");
        }
        if(currentBrand.getActived()){
            currentBrand.setActived(Boolean.FALSE);
            currentBrand.setDeletedAt(new Timestamp(System.currentTimeMillis()));
            currentBrand.setModifiedAt(new Timestamp(System.currentTimeMillis()));
            repo.saveAndFlush(currentBrand);
        }else{
            currentBrand.setActived(Boolean.TRUE);
            currentBrand.setModifiedAt(new Timestamp(System.currentTimeMillis()));
            repo.saveAndFlush(currentBrand);
        }
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
