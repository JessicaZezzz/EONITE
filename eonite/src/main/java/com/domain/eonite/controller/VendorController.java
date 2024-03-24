package com.domain.eonite.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.domain.eonite.dto.BankRes;
import com.domain.eonite.dto.ProductRes;
import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.entity.Vendor;
import com.domain.eonite.service.ProductService;
import com.domain.eonite.service.VendorService;

@RestController
@CrossOrigin("*")
@RequestMapping("/vendor")
public class VendorController {
    @Autowired
    private VendorService vendorService;
    
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

    @PutMapping("/updateProfileVendor")
    public ResponseEntity<VendorRes> updateProfile(@RequestBody VendorRes request){
        return ResponseEntity.ok(vendorService.editProfile(request));
    }

    @PostMapping("/checkPasswordVendor")
    public ResponseEntity<VendorRes> checkPassword(@RequestBody Vendor request){
        return ResponseEntity.ok(vendorService.checkPassword(request));
    }

    @PostMapping("/changePasswordVendor")
    public ResponseEntity<VendorRes> changePassword(@RequestBody Vendor request){
        return ResponseEntity.ok(vendorService.changePassword(request));
    }

    @PostMapping("/addBankAccount")
    public ResponseEntity<BankRes> addBankAccount(@RequestBody BankRes request){
        return ResponseEntity.ok(vendorService.addBankAccount(request));
    }

    @PutMapping("/updateBankAccount")
    public ResponseEntity<BankRes> updateBankAccount(@RequestBody BankRes request){
        return ResponseEntity.ok(vendorService.updateBankAccount(request));
    }

    @GetMapping("/bankAccount")
    public ResponseEntity<BankRes> getBankAccount(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(vendorService.getBankAccount(id));
    }

    @DeleteMapping("/deleteBankAccount/{id}")
    public ResponseEntity<BankRes> deleteBankAccount(@PathVariable("id") Integer id){
        return ResponseEntity.ok(vendorService.deleteBankAccount(id));
    }
}