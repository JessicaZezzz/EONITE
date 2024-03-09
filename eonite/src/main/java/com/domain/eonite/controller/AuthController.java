package com.domain.eonite.controller;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.*;
import com.domain.eonite.entity.*;
import com.domain.eonite.service.*;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/signupUser")
    public ResponseEntity<UserRes> signUp(@RequestBody Users signUpRequest){
        return ResponseEntity.ok(authService.signUpUser(signUpRequest));
    }

    @PostMapping("/signupVendor")
    public ResponseEntity<VendorRes> signUp(@RequestBody VendorRes signUpRequest){
        return ResponseEntity.ok(authService.signUpVendor(signUpRequest));
    }
    
    @PostMapping("/signinUser")
    public ResponseEntity<ReqRes> signInUser(@RequestBody ReqRes signInRequest){
        return ResponseEntity.ok(authService.signInUser(signInRequest));
    }

    @PostMapping("/signinVendor")
    public ResponseEntity<ReqRes> signInVendor(@RequestBody ReqRes signInRequest){
        return ResponseEntity.ok(authService.signInVendor(signInRequest));
    }

    @GetMapping("/checkEmailUser/{email}")
    public Optional<Users> findEmailUser(@PathVariable("email") String email) {
        return authService.findByEmailUser(email);
    }

    @GetMapping("/checkEmailVendor/{email}")
    public Optional<Vendor> findEmailVendor(@PathVariable("email") String email) {
        return authService.findByEmailVendor(email);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes refreshTokenRequest){
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
    }
    
}
