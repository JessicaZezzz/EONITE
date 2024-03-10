package com.domain.eonite.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.entity.Vendor;
import com.domain.eonite.service.VendorService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class VendorController {
    @Autowired
    private VendorService vendorService;
    
    // @GetMapping("/getAllVendor")
    // public ResponseEntity<VendorRes> getAllUser(  @RequestParam(required = false,name = "sortBy") String sortBy, 
    //                                 @RequestParam(required = false,name = "sortDir") String sortDir, 
    //                                 @RequestParam(required = false,name = "pagination") Boolean pagination, 
    //                                 @RequestParam(required = false,name = "pageSize") Integer pageSize, 
    //                                 @RequestParam(required = false,name = "pageIndex") Integer pageIndex,
    //                                 @RequestParam(required = false,name = "searchBy") String searchBy, 
    //                                 @RequestParam(required = false,name = "searchParam") String searchParam){
    //     return ResponseEntity.ok(vendorService.getAllUser(searchBy, searchParam, sortBy, sortDir, pagination, pageSize, pageIndex));
    // }

    @GetMapping("/vendorProfile")
    public ResponseEntity<VendorRes> getProfile(  @RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(vendorService.getProfileVendor(id));
    }

    // @PostMapping("/updateProfile")
    // public ResponseEntity<VendorRes> updateProfile(@RequestBody Vendor signUpRequest){
    //     return ResponseEntity.ok(vendorService.editProfile(signUpRequest));
    // }

    @PostMapping("/checkPasswordVendor")
    public ResponseEntity<VendorRes> checkPassword(@RequestBody Vendor signUpRequest){
        return ResponseEntity.ok(vendorService.checkPassword(signUpRequest));
    }

    @PostMapping("/changePasswordVendor")
    public ResponseEntity<VendorRes> changePassword(@RequestBody Vendor signUpRequest){
        return ResponseEntity.ok(vendorService.changePassword(signUpRequest));
    }
}