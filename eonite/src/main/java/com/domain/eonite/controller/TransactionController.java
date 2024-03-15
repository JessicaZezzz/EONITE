package com.domain.eonite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.domain.eonite.dto.PaymentRes;
import com.domain.eonite.dto.TransRes;
import com.domain.eonite.service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@CrossOrigin("*")
@RequestMapping("/public")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/addTransaction")
    public ResponseEntity<TransRes> addTransaction(@RequestBody TransRes request){
        return ResponseEntity.ok(transactionService.addTransaction(request));
    }
    
    @PutMapping("/updateState")
    public ResponseEntity<TransRes> updateTransaction(@RequestBody TransRes request){
        return ResponseEntity.ok(transactionService.updateState(request));
    }

    @PutMapping("/updatePayment")
    public ResponseEntity<PaymentRes> updatePayment(@RequestBody PaymentRes request){
        return ResponseEntity.ok(transactionService.updatePayment(request));
    }

    @GetMapping("/getTransaction")
    public ResponseEntity<TransRes> getTransactionDetail(@RequestParam(required = true,name = "id") Integer id){
        return ResponseEntity.ok(transactionService.getTransactionDetail(id));
    }
    
    @GetMapping("/getTransactionUsers")
    public ResponseEntity<TransRes> getAllTransactionUser(@RequestParam(required = true,name = "id") Integer id,
                                                        @RequestParam(required = true,name = "state") String state){
        return ResponseEntity.ok(transactionService.getAllUserTransaction(id,state));
    }

    @GetMapping("/getTransactionVendor")
    public ResponseEntity<TransRes> getAllTransactionVendor(@RequestParam(required = true,name = "id") Integer id,
                                                            @RequestParam(required = true,name = "state") String state){
        return ResponseEntity.ok(transactionService.getAllVendorTransaction(id,state));
    }
    
}
