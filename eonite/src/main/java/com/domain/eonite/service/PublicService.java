package com.domain.eonite.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.entity.Category;
import com.domain.eonite.entity.Domicile;
import com.domain.eonite.repository.CategoryRepo;
import com.domain.eonite.repository.DomicileRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PublicService {
    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private DomicileRepo domicileRepo;

    public List<Category> findAllCategory() {
        return categoryRepo.findAllByOrderByName();
    }

    public List<Domicile> findAllDomicile() {
        return domicileRepo.findAllByOrderByName();
    }
}
