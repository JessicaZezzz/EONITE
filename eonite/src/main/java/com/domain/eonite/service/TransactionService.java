package com.domain.eonite.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.PaymentRes;
import com.domain.eonite.dto.TransRes;
import com.domain.eonite.entity.FundTransaction;
import com.domain.eonite.entity.Payment;
import com.domain.eonite.entity.Product;
import com.domain.eonite.entity.Transaction;
import com.domain.eonite.entity.TransactionDetail;
import com.domain.eonite.repository.CartRepo;
import com.domain.eonite.repository.FundTransRepo;
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

    @Autowired
    private FundTransRepo fundTransRepo;

    private Integer totals;

    public TransRes addTransaction(TransRes request){
        TransRes resp = new TransRes();
            Transaction trans = new Transaction();
                trans.setDescription(request.getDescription());
                trans.setState("WAITING-CONFIRMATION");
                trans.setTransdate(new Date());
                trans.setTotal(0);
                trans.setUser(userRepo.findById(request.getUserId()).get());
                trans.setVendor(vendorRepo.findById(request.getVendorId()).get());
        String timestamp = Long.toString(System.currentTimeMillis());
        String randomPart = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 9);
                trans.setInvoice("INV/" + timestamp + "/EONITE/" + randomPart);
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
    private Double totalRefund = 0.0;
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
                        // kirim email
                    break;

                    case "REJECT":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
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
                        // kirim
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
                    case "CANCEL_USER":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                        },null);
                        FundTransaction funding = new FundTransaction();
                        funding.setRejectedBy("USER");
                        funding.setAlasanRejected(request.getDescription());
                        funding.setTimestamp(new Date());
                        paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                            funding.setBankAccountUser(payment.getBankAccount());
                        },null);
                        funding.setState("WAITING-REFUND");
                        funding.setTransId(request.getId());
                        funding.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        funding.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        totalRefund = 0.0;
                        transactionRepo.findById(request.getId()).get().getTransDet().forEach((trans)->{
                            String[] dateArray = trans.getBookdate().split(",");
                            List<LocalDate> localDates = new ArrayList<>();
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                            for (String dateStr : dateArray) {
                                LocalDate localDate = LocalDate.parse(dateStr, formatter);
                                localDates.add(localDate);
                            }
                            LocalDate rejectedDate = null;
                            for (LocalDate date : localDates) {
                                if (rejectedDate == null || date.isBefore(rejectedDate)) {
                                    rejectedDate = date;
                                }
                            }
                            Double totaltransDet=0.0;
                            Date currentDate = new Date();
                            LocalDate transDate = currentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                            // Check Rejected Date must less than booking date
                            // If rejected date greater than booking date, then refund to user automatically 0 and refund to vendor 100%;
                            if(transDate.compareTo(rejectedDate)<0){
                                long daysDifference = ChronoUnit.DAYS.between(transDate, rejectedDate);
                                if(daysDifference >= 15){
                                    totaltransDet = (double) (trans.getQuantity()*trans.getProduct().getPrice()*1.0);
                                }else if(daysDifference <=14 && daysDifference >7){
                                    totaltransDet = (double) (trans.getQuantity()*trans.getProduct().getPrice()*0.5);
                                }else if(daysDifference <=7 && daysDifference >3){
                                    totaltransDet = (double) (trans.getQuantity()*trans.getProduct().getPrice()*0.25);
                                }else if(daysDifference <=3){
                                    totaltransDet = (double) (trans.getQuantity()*trans.getProduct().getPrice()*0.0);
                                }
                            }else{
                                totaltransDet = (double) (trans.getQuantity()*trans.getProduct().getPrice()*0.0);
                            }
                            totalRefund += totaltransDet;
                        });

                        funding.setTotalFundUser(totalRefund);
                        funding.setTotalFundVendor(transactionRepo.findById(request.getId()).get().getTotal()-totalRefund);
                        fundTransRepo.save(funding);
                    break;
                    case "CANCEL_VENDOR":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                        },null);
                        FundTransaction fundings = new FundTransaction();
                        fundings.setRejectedBy("VENDOR");
                        fundings.setAlasanRejected(request.getDescription());
                        fundings.setTimestamp(new Date());
                        paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                            fundings.setBankAccountUser(payment.getBankAccount());
                        },null);
                        fundings.setState("WAITING-REFUND");
                        fundings.setTransId(request.getId());
                        fundings.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        fundings.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        fundings.setTotalFundUser(transactionRepo.findById(request.getId()).get().getTotal()*1.0);
                        fundings.setTotalFundVendor(0.0);
                        fundTransRepo.save(fundings);
                    break;
                    case "DONE":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("COMPLETED");
                            transactionRepo.save(trans);
                        },null);
                        FundTransaction fundings2 = new FundTransaction();
                        fundings2.setAlasanRejected("Payment Completed Transaction");
                        fundings2.setTimestamp(new Date());
                        paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                            fundings2.setBankAccountUser(payment.getBankAccount());
                        },null);
                        fundings2.setState("WAITING-REFUND");
                        fundings2.setTransId(request.getId());
                        fundings2.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        fundings2.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        fundings2.setTotalFundUser(0.0);
                        fundings2.setTotalFundVendor(transactionRepo.findById(request.getId()).get().getTotal()*1.0);
                        fundTransRepo.save(fundings2);
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
            payment.setBankAccount(request.getBankAccount());
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
        List<Transaction> trans = new ArrayList<Transaction>();
        if(state.equals("ALL")) trans = transactionRepo.findByUser(userRepo.findById(id).get());
        else trans = transactionRepo.findByUserAndState(userRepo.findById(id).get(),state);
        trans.forEach((e)->{
            e.setVendor(e.getVendor());
        });
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
        List<Transaction> trans = new ArrayList<Transaction>();
        if(state.equals("ALL")) trans = transactionRepo.findByVendor(vendorRepo.findById(id).get());
        else trans = transactionRepo.findByVendorAndState(vendorRepo.findById(id).get(),state);
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

    // public 


}
