package com.domain.eonite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.ProductRes;
import com.domain.eonite.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/addProduct")
    public ResponseEntity<ProductRes> addProduct(@RequestBody ProductRes request){
        return ResponseEntity.ok(productService.addProduct(request));
    }

    @PutMapping("/updateProduct")
    public ResponseEntity<ProductRes> updateProduct(@RequestBody ProductRes request){
        return ResponseEntity.ok(productService.updateProduct(request));
    }

    @GetMapping("/getProductbyId")
    public ResponseEntity<ProductRes> getProduct(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/getProductbyVendorId")
    public ResponseEntity<ProductRes> getProductbyVendor(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(productService.getProductbyVendor(id));
    }

    // @DeleteMapping("/deleteProduct/{id}")
    // public ResponseEntity<ProductRes> deleteProduct(@PathVariable("id") Integer id){
    //     return ResponseEntity.ok(productService.deleteProduct(id));
    // }
    
}
