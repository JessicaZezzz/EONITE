package com.domain.eonite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.domain.eonite.dto.ProductRes;
import com.domain.eonite.dto.ProductReviewRes;
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

    @GetMapping("/getProductbyId")
    public ResponseEntity<ProductRes> getProduct(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/getProductbyVendorId")
    public ResponseEntity<ProductRes> getProductbyVendor(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(productService.getProductbyVendor(id));
    }

    @PostMapping("/addReview")
    public ResponseEntity<ProductReviewRes> addProductReview(@RequestBody ProductReviewRes request){
        return ResponseEntity.ok(productService.addProductReview(request));
    }

    @PutMapping("/updateProductReview")
    public ResponseEntity<ProductReviewRes> updateProductReview(@RequestBody ProductReviewRes request){
        return ResponseEntity.ok(productService.updateProductReview(request));
    }

    @GetMapping("/getAllProductReview")
    public ResponseEntity<ProductReviewRes> getProductReviewbyProduct(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(productService.getProductReviewbyProduct(id));
    }

    @GetMapping("/getProductReviewHome")
    public ResponseEntity<ProductReviewRes> getProductReview(){
        return ResponseEntity.ok(productService.getProductReview());
    }
}
