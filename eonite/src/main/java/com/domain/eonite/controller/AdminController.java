package com.domain.eonite.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.service.VendorService;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private VendorService vendorService;

    @GetMapping("/get-vendor-pending")
    public ResponseEntity<VendorRes> getVendorPending(){
        return ResponseEntity.ok(vendorService.getVendorPending());
    }

    @PutMapping("/update-state-vendor")
    public ResponseEntity<VendorRes> updateVendorState(@RequestBody VendorRes request){
        return ResponseEntity.ok(vendorService.updateVendorState(request));
    }
}
