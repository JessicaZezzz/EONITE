package com.domain.eonite.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.entity.Category;
import com.domain.eonite.entity.Domicile;
import com.domain.eonite.repository.CategoryRepo;
import com.domain.eonite.repository.DomicileRepo;
import com.domain.eonite.repository.SubCategoryRepo;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PublicService {
    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private DomicileRepo domicileRepo;

    @Autowired
    private SubCategoryRepo subCategoryRepo;

    public List<Category> findAllCategory() {
        return categoryRepo.findAllByOrderByName();
    }

    public List<Domicile> findAllDomicile() {
        return domicileRepo.findAllByOrderByName();
    }

    public Optional<Object> findCategoryById(Integer id) {
        return subCategoryRepo.getCategory(id);
    }

    public List<Object> findIdCategoryVendor(Integer id){
        return subCategoryRepo.getCategoryId(id);
    }

    public Optional<Domicile> findDomicileById(Integer id) {
        return domicileRepo.findById(id);
    }

}
