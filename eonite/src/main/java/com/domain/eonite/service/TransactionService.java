package com.domain.eonite.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.TransRes;
import com.domain.eonite.entity.Product;
import com.domain.eonite.entity.Transaction;
import com.domain.eonite.entity.TransactionDetail;
import com.domain.eonite.repository.CartRepo;
import com.domain.eonite.repository.ProductRepo;
import com.domain.eonite.repository.TransactionDetailRepo;
import com.domain.eonite.repository.TransactionRepo;
import com.domain.eonite.repository.UserRepo;
import com.domain.eonite.repository.VendorRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class TransactionService {
    @Autowired
    private CartRepo cartRepository;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private TransactionDetailRepo transactionDetailRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired 
    private VendorRepo vendorRepo;

    @Autowired
    private ProductRepo productRepo;

    private Integer totals;

    public TransRes addTransaction(TransRes request){
        TransRes resp = new TransRes();
            Transaction trans = new Transaction();
                trans.setDescription(null);
                trans.setState("WAITING-CONFIRMATION");
                trans.setTransdate(new Date());
                trans.setTotal(0);
                trans.setUser(userRepo.findById(request.getUserId()).get());
                trans.setVendor(vendorRepo.findById(request.getVendorId()).get());
            Integer transId = transactionRepo.save(trans).getId();
            totals=0;
        for(Integer index : request.getCartId()){
            cartRepository.findById(index).ifPresentOrElse((cart)->{
                TransactionDetail transDet = new TransactionDetail();
                Product p = productRepo.findById(cart.getProduct().getId()).get();
                    transDet.setQuantity(cart.getQuantity());
                    transDet.setBookdate(cart.getBookdate());
                    transDet.setProduct(p);
                    transDet.setTransaction(transactionRepo.findById(transId).get());
                    transactionDetailRepo.save(transDet);
                totals += (cart.getQuantity()*p.getPrice());
                cartRepository.deleteById(index);
            },()->{
                resp.setStatusCode(500);
                resp.setError("Cart No Found");
            });
        }
        transactionRepo.findById(transId).ifPresentOrElse((transD)->{
            transD.setTotal(totals);
            transactionRepo.save(transD);
        },null);
        try{
            resp.setMessage("Success Add Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    private TransRes
}
