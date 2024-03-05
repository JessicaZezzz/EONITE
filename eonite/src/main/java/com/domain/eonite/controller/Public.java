package com.domain.eonite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.domain.eonite.entity.Category;
import com.domain.eonite.entity.Domicile;
import com.domain.eonite.entity.Photo;
import com.domain.eonite.repository.PhotoRepository;
import com.domain.eonite.service.PublicService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class Public {
    @Autowired
    private PublicService publicService;

    @Autowired
    private PhotoRepository photoRepository;

    @GetMapping("/category")
    public Iterable<Category> getAllCategory() {
        return publicService.findAllCategory();
    }

    @GetMapping("/domicile")
    public Iterable<Domicile> getAllDomicle() {
        return publicService.findAllDomicile();
    }
    
    @PostMapping("/uploadPhoto")
    public Photo uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        Photo img = new Photo(file.getOriginalFilename(), file.getContentType(), file.getBytes());
        final Photo savedImage = photoRepository.save(img);
        return savedImage;
    }
}
