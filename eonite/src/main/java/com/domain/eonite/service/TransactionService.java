package com.domain.eonite.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.PaymentRes;
import com.domain.eonite.dto.TransRes;
import com.domain.eonite.entity.Payment;
import com.domain.eonite.entity.Product;
import com.domain.eonite.entity.Transaction;
import com.domain.eonite.entity.TransactionDetail;
import com.domain.eonite.repository.CartRepo;
import com.domain.eonite.repository.PaymentRepo;
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

    @Autowired 
    private PaymentRepo paymentRepo;

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

    public TransRes updateState(TransRes request){
        TransRes resp = new TransRes();
        switch(request.getPrevState()){
            case "WAITING-CONFIRMATION":
                switch(request.getAction()){
                    case "ACCEPT":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("WAITING-PAYMENT");
                            Payment p = new Payment();
                            p.setState("NONE");
                            p.setTransaction(trans);
                            paymentRepo.save(p);
                            transactionRepo.save(trans);
                        },null);
                    break;

                    case "REJECT":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            trans.setDescription("Rejected caused: "+request.getDescription());
                            transactionRepo.save(trans);
                        },null);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                        },null);
                    break;
                }
            break;

            case "WAITING-PAYMENT":
                switch(request.getAction()){
                    case "ACCEPT":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("ON-GOING");
                            paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                                payment.setState("ACCEPTED");
                                payment.setDescription(null);
                                paymentRepo.save(payment);
                            },null);
                            transactionRepo.save(trans);
                        },null);
                    break;

                    case "REJECT":
                        paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                            payment.setState("REJECTED");
                            payment.setDescription(request.getDescription());
                            paymentRepo.save(payment);
                        },null);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                        },null);
                    break;
                }
            break;

            case "ON-GOING":
                switch(request.getAction()){
                    case "DONE":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("COMPLETED");
                            transactionRepo.save(trans);
                        },null);
                    break;
                }
            break;

            default:
            break;
        }
        try{
            resp.setMessage("Success Update Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public PaymentRes updatePayment(PaymentRes request){
        PaymentRes resp = new PaymentRes();
        paymentRepo.findByTransaction(transactionRepo.findById(request.getTransId()).get()).ifPresentOrElse((payment)->{
            payment.setDate(new Date());
            payment.setImage(request.getImage());
            payment.setState("WAITING-CONFIRMATION");
            payment.setDescription(null);
            paymentRepo.save(payment);
        }, null);
        try{
            resp.setMessage("Success Update Payment");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes getTransactionDetail(Integer id){
        TransRes resp = new TransRes();	
        Transaction trans = transactionRepo.findById(id).get();
        try{
            resp.setTransaction(trans);
            resp.setMessage("Success Get Detail Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes getAllUserTransaction(Integer id,String state){
        TransRes resp = new TransRes();	
        List<Transaction> trans = transactionRepo.findByUserAndState(userRepo.findById(id).get(),state);
        try{
            resp.setTransactions(trans);
            resp.setMessage("Success Get Detail Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes getAllVendorTransaction(Integer id, String state){
        TransRes resp = new TransRes();	
        List<Transaction> trans = transactionRepo.findByVendorAndState(vendorRepo.findById(id).get(),state);
        try{
            resp.setTransactions(trans);
            resp.setMessage("Success Get Detail Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


}
