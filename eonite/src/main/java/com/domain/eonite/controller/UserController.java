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

import com.domain.eonite.dto.UserRes;
import com.domain.eonite.entity.Users;
import com.domain.eonite.service.UserService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/getAllUser")
    public ResponseEntity<UserRes> getAllUser(  @RequestParam(required = false,name = "sortBy") String sortBy, 
                                    @RequestParam(required = false,name = "sortDir") String sortDir, 
                                    @RequestParam(required = false,name = "pagination") Boolean pagination, 
                                    @RequestParam(required = false,name = "pageSize") Integer pageSize, 
                                    @RequestParam(required = false,name = "pageIndex") Integer pageIndex,
                                    @RequestParam(required = false,name = "searchBy") String searchBy, 
                                    @RequestParam(required = false,name = "searchParam") String searchParam){
        return ResponseEntity.ok(userService.getAllUser(searchBy, searchParam, sortBy, sortDir, pagination, pageSize, pageIndex));
    }

    @GetMapping("/userProfile")
    public ResponseEntity<UserRes> getProfile(  @RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(userService.getProfileUser(id));
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<UserRes> updateProfile(@RequestBody Users signUpRequest){
        return ResponseEntity.ok(userService.editProfile(signUpRequest));
    }

    @PostMapping("/checkPassword")
    public ResponseEntity<UserRes> checkPassword(@RequestBody Users signUpRequest){
        return ResponseEntity.ok(userService.checkPassword(signUpRequest));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<UserRes> changePassword(@RequestBody Users signUpRequest){
        return ResponseEntity.ok(userService.changePassword(signUpRequest));
    }
}
