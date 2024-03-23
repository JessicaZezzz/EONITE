package com.domain.eonite.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.domain.eonite.entity.Category;
import com.domain.eonite.entity.Domicile;
import com.domain.eonite.service.PublicService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class Public {
    @Autowired
    private PublicService publicService;

    @GetMapping("/categoryAll")
    public List<Category> getAllCategory() {
        return publicService.findAllCategory();
    }

    @GetMapping("/domicileAll")
    public Iterable<Domicile> getAllDomicle() {
        return publicService.findAllDomicile();
    }

    @GetMapping("/category")
    public Optional<Object> getCategoryById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findCategoryById(id);
    }

    @GetMapping("/categoryVendor")
    public List<Object> getCategoryVendorById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findIdCategoryVendor(id);
    }

    @GetMapping("/domicile")
    public Optional<Domicile> getDomicleById(@RequestParam(required = true,name = "id") Integer id) {
        return publicService.findDomicileById(id);
    }

}
