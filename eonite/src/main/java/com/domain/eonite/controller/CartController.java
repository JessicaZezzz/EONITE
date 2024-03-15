package com.domain.eonite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.CartRes;
import com.domain.eonite.service.CartService;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/addCart")
    public ResponseEntity<CartRes> addCart(@RequestBody CartRes request){
        return ResponseEntity.ok(cartService.addCart(request));
    }

    @PutMapping("/updateCart")
    public ResponseEntity<CartRes> updateCart(@RequestBody CartRes request){
        return ResponseEntity.ok(cartService.updateCart(request));
    }

    @GetMapping("/getCartbyId")
    public ResponseEntity<CartRes> getCart(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(cartService.getCart(id));
    }

    @PostMapping("/deleteCart")
    public ResponseEntity<CartRes> deleteCart(@RequestBody CartRes request){
        return ResponseEntity.ok(cartService.deleteCart(request));
    }
}
