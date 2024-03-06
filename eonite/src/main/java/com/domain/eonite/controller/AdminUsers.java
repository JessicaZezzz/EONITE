package com.domain.eonite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.ReqRes;
import com.domain.eonite.entity.Product;
import com.domain.eonite.repository.CategoryRepo;
import com.domain.eonite.repository.ProductRepo;

@RestController
public class AdminUsers {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @GetMapping("/public/product")
    public ResponseEntity<Object> getAllProduct() {
        return ResponseEntity.ok(productRepo.findAll());
    }
    
    @PostMapping("/admin/saveproduct")
    public ResponseEntity<Object> addProduct(@RequestBody ReqRes productRequest){
        Product productToSave = new Product();
        // productToSave.setName(productRequest.getName());
        return ResponseEntity.ok(productRepo.save(productToSave));
    }

    @GetMapping("/user/alone")
    public ResponseEntity<Object> userAlone() {
        return ResponseEntity.ok("Users alone can access this API only");
    }

    @GetMapping("/adminuser/both")
    public ResponseEntity<Object> bothAdminandUserAPI() {
        return ResponseEntity.ok("Both admin and user can alone access this api only");
    }
    
}
