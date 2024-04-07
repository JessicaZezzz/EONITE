package com.domain.eonite.controller;
import com.domain.eonite.dto.*;
import com.domain.eonite.entity.*;
import com.domain.eonite.service.*;

import jakarta.mail.MessagingException;

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

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/generate-otp")
    public ResponseEntity<TokenRes> generateOTP(@RequestBody TokenRes generateOTPRequest) throws MessagingException {
        return ResponseEntity.ok(emailService.generateOTP(generateOTPRequest));
    }

    @PostMapping("/generate-otp-login")
    public ResponseEntity<TokenRes> generateOTPlogin(@RequestBody TokenRes generateOTPRequest) throws MessagingException {
        return ResponseEntity.ok(emailService.generateOTPlogin(generateOTPRequest));
    }

    @PostMapping("/check-otp")
    public ResponseEntity<TokenRes> checkOTP(@RequestBody TokenRes generateOTPRequest) throws MessagingException {
        return ResponseEntity.ok(emailService.checkOTP(generateOTPRequest));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<TokenRes> resetPassword(@RequestBody TokenRes generateOTPRequest) throws MessagingException {
        return ResponseEntity.ok(emailService.resetPassword(generateOTPRequest));
    }
    
}
