package com.domain.eonite.service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.DashboardRes;
import com.domain.eonite.dto.FundTransRes;
import com.domain.eonite.dto.PaymentRes;
import com.domain.eonite.dto.TransRes;
import com.domain.eonite.dto.emailInvoice;
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
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import jakarta.transaction.Transactional;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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

    @Autowired
    private JavaMailSender javaMailSender;
    
    @Autowired
    private TemplateEngine templateEngine;

    private Integer totals;

    public TransRes addTransaction(TransRes request) throws MessagingException{
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
            try {
                sendEmailInvoice(transId,"USER");
                sendEmailInvoice(transId,"VENDOR");
            } catch (MessagingException e) {
                e.printStackTrace();
            }
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

    public void sendEmailInvoice(Integer id,String subject) throws MessagingException{
        transactionRepo.findById(id).ifPresentOrElse((trans)->{
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper;
            try {
                helper = new MimeMessageHelper(msg, true);
                try {
                    if(subject.equals("USER")) helper.setTo(trans.getUser().getEmail());
                    else helper.setTo(trans.getVendor().getEmail());
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
                try {
                    if(subject.equals("USER")) helper.setSubject("You have just placed an order [EONITE]");
                    else helper.setSubject("You just got an order [EONITE]");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
                Context context = new Context();
                if(subject.equals("USER")){
                    context.setVariable("receiver", trans.getUser().getFirstName() +" "+ trans.getUser().getLastName());
                    context.setVariable("message","Thank you for placing an order with "+trans.getVendor().getUsernameVendor());
                } 
                else{
                    context.setVariable("receiver", trans.getVendor().getUsernameVendor());
                    context.setVariable("message","");
                } 
                context.setVariable("invoice",trans.getInvoice());

                LocalDateTime localDateTime = trans.getTransdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
                DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
                // LocalDate localDate = LocalDate.parse(trans.getTransdate().toString(), inputFormatter);
                
                String formattedDate = localDateTime.format(outputFormatter);
                context.setVariable("transDt", formattedDate);

                context.setVariable("usernameVendor", trans.getVendor().getUsernameVendor());
                context.setVariable("emailVendor", trans.getVendor().getEmail());
                context.setVariable("phoneVendor", trans.getVendor().getPhoneBusiness());
                context.setVariable("addressVendor", trans.getVendor().getAddress());

                context.setVariable("nameUser", trans.getUser().getFirstName() +" "+ trans.getUser().getLastName());
                context.setVariable("emailUser", trans.getUser().getEmail());
                context.setVariable("phoneUser", trans.getUser().getPhoneNumber());

                List<emailInvoice> productList = new ArrayList<emailInvoice>();
                List<TransactionDetail> transDet =  transactionDetailRepo.findAllByTransactionId(id);
                
                if(transDet != null){
                    transDet.forEach(t->{
                        emailInvoice tmp = new emailInvoice();
                        tmp.setName(t.getProduct().getName());
                        BigDecimal amount = new BigDecimal(t.getProduct().getPrice()*t.getQuantity()); // Your BigDecimal here
                        Locale indonesiaLocale = new Locale("id", "ID");
                        NumberFormat formatIDR = NumberFormat.getCurrencyInstance(indonesiaLocale);
                        String formattedIDR = formatIDR.format(amount);
                        tmp.setPrice(formattedIDR);
                        tmp.setQty(t.getQuantity());
                        String[] dateArray = t.getBookdate().split(",");
                        List<LocalDate> localDates = new ArrayList<>();
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                            for (String dateStr : dateArray) {
                                LocalDate localDt = LocalDate.parse(dateStr, formatter);
                                localDates.add(localDt);
                            }
                        tmp.setBookingDate(localDates.toString());
                        productList.add(tmp);
                    });
                }
                
                context.setVariable("productList",productList);

                BigDecimal amount = new BigDecimal(trans.getTotal().toString()); // Your BigDecimal here
                Locale indonesiaLocale = new Locale("id", "ID");
                NumberFormat formatIDR = NumberFormat.getCurrencyInstance(indonesiaLocale);
                String formattedIDR = formatIDR.format(amount);
                context.setVariable("grandTotal",formattedIDR);
                String htmlContent = templateEngine.process("generateinvoice", context);
                try {
                    helper.setText(htmlContent,true);
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
                javaMailSender.send(msg);
            } catch (MessagingException e) {
                e.printStackTrace();
            } 
        },null);
    }

    public void sendEmailOrder(String email, String message, String username) throws MessagingException{
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(msg, true);
            try {
                helper.setTo(email);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            try {
                helper.setSubject("Order Confirmation [EONITE]");
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("message",message);

            String htmlContent = templateEngine.process("confirmation", context);
            try {
                helper.setText(htmlContent,true);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            javaMailSender.send(msg);
        } catch (MessagingException e) {
            e.printStackTrace();
        } 
    }
    
    private Double totalRefund = 0.0;
    public TransRes updateState(TransRes request)throws MessagingException{
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
                            String messageUser = "Your order "+ trans.getInvoice() +" has been accepted by the vendor. Please continue payment by uploading proof of payment on the transaction page. If payment has not been completed within 24 hours, the system will automatically cancel the order. We will notify you of any new updates via this email.";
                            String messageVendor = "Thank you for confirming the order "+ trans.getInvoice() +". Please wait for payment from the User. We will notify you if there are any new updates via this email.";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                    break;

                    case "REJECT":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Sorry, your order #"+ trans.getInvoice() +" has been rejected by the vendor. We value your business and look forward to serving you again.Thank you for using EONITE.";
                            String messageVendor = "Thank you for confirming the order "+ trans.getInvoice() +". We will notify the user that this order is cancelled.We value your business and look forward to serving you again.Thank you for using EONITE.";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Sorry, your order #"+ trans.getInvoice() +" has been canceled. We value your business and look forward to serving you again.Thank You!";
                            String messageVendor = "Sorry, your order #"+ trans.getInvoice() +" has been canceled. We value your business and look forward to serving you again.Thank You!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
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
                            String messageUser = "We have received proof of payment for your order #"+ trans.getInvoice() +" and the order can proceed to the next stage [ON GOING]. Thank you!";
                            String messageVendor = "The buyer has finished making payment, and the order #"+ trans.getInvoice() +" has proceeded to the next stage [ON GOING]. You can now follow up on your order. Thank You!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                    break;

                    case "REJECT":
                        paymentRepo.findByTransaction(transactionRepo.findById(request.getId()).get()).ifPresentOrElse((payment)->{
                            payment.setState("REJECTED");
                            payment.setDescription(request.getDescription());
                            paymentRepo.save(payment);
                            String messageUser = "Sorry, your proof of payment for order #"+ transactionRepo.findById(request.getId()).get().getInvoice() +" was rejected due to "+ request.getDescription() +".Please re-upload proof of payment to proceed to the next stage. Thank You";
                            try {
                                sendEmailOrder(transactionRepo.findById(request.getId()).get().getUser().getEmail(),messageUser,transactionRepo.findById(request.getId()).get().getUser().getFirstName()+" "+transactionRepo.findById(request.getId()).get().getUser().getLastName());
                            } catch (MessagingException e) {}
                        },null);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Sorry, your order #"+ trans.getInvoice() +" has been canceled. We value your business and look forward to serving you again.Thank You!";
                            String messageVendor = "Sorry, your order #"+ trans.getInvoice() +" has been canceled. We value your business and look forward to serving you again.Thank You!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
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
                            String messageUser = "Sorry, your order #"+ trans.getInvoice() +" has been canceled by "+trans.getUser().getFirstName()+" "+trans.getUser().getLastName() +" due to "+ request.getDescription() +". We will refund the payments made according to EONITE's rules and regulations. You can check your payment returns periodically in the Refund feature. Thankyou!";
                            String messageVendor = "Sorry, your order #"+ trans.getInvoice() +" has been canceled by "+trans.getUser().getFirstName()+" "+trans.getUser().getLastName() +" due to "+ request.getDescription() +". We will transfer funds to you in accordance with EONITE's rules and regulations. You can check your payments periodically in the Payment feature. Thankyou!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
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
                            String messageUser = "Sorry, your order #"+ trans.getInvoice() +" has been canceled by "+trans.getVendor().getUsernameVendor() +" due to "+ request.getDescription() +". We will refund the payments made according to EONITE's rules and regulations. You can check your payment returns periodically in the Refund feature. Thankyou!";
                            String messageVendor = "Sorry, your order #"+ trans.getInvoice() +" has been canceled by "+trans.getVendor().getUsernameVendor() +" due to "+ request.getDescription() +". We will transfer funds to you in accordance with EONITE's rules and regulations. You can check your payments periodically in the Payment feature. Thankyou!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
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
                            String messageUser = "Congratulations! You have completed your order #"+ trans.getInvoice() +". Thank you for transacting using EONITE. You can provide suggestions and input on the Transactions page. Contact EONITE if you experience difficulties. Thankyou!";
                            String messageVendor = "Congratulations! You have completed order #"+ trans.getInvoice() +". We will process your payment immediately. Please check the payment features regularly. Thank You!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
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

    public TransRes getPendingPaymentTransaction(){
        TransRes resp = new TransRes();	
        List<Transaction> trans = transactionRepo.findAllByState("WAITING-PAYMENT")
                                                .stream()
                                                .filter(f->f.getPayment().getState().equals("WAITING-CONFIRMATION"))
                                                .collect(Collectors.toList());
        try{
            resp.setTransactions(trans);
            resp.setMessage("Success Get Pending Transaction");
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
            String messageUser = "You have just uploaded proof of payment for the order #"+ transactionRepo.findById(request.getTransId()).get().getInvoice() +". Please wait for confirmation from us for the next stage. We are processing your payment. Thank You!";
            try {
                sendEmailOrder(transactionRepo.findById(request.getTransId()).get().getUser().getEmail(),messageUser,transactionRepo.findById(request.getTransId()).get().getUser().getFirstName()+" "+transactionRepo.findById(request.getTransId()).get().getUser().getLastName());
            } catch (MessagingException e) {}
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

    public TransRes getAllRefundTrans(){
        TransRes resp = new TransRes();	
        List<FundTransRes> funds = new ArrayList<FundTransRes>();
        List<FundTransaction> fundTranss = fundTransRepo.findAllByState("WAITING-REFUND");
        fundTranss.forEach((fund)->{
            FundTransRes res = new FundTransRes();
            res.setId(fund.getId());
            res.setRejectedBy(fund.getRejectedBy());
            res.setAlasanRejected(fund.getAlasanRejected());
            res.setTimestamp(fund.getTimestamp());
            res.setBankAccountUser(fund.getBankAccountUser());
            res.setState(fund.getState());
            res.setTotalFundUser(fund.getTotalFundUser());
            res.setTotalFundVendor(fund.getTotalFundVendor());
            res.setTfUser(fund.getTfUser());
            res.setTfVendor(fund.getTfVendor());
            res.setTransaction(transactionRepo.findById(fund.getTransId()).get());
            funds.add(res);
        });
        try{
            resp.setFundTransactions(funds);
            resp.setMessage("Success Get All Refund Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes getAllRefundTransByUser(Integer id){
        TransRes resp = new TransRes();	
        List<FundTransRes> funds = new ArrayList<FundTransRes>();
        List<FundTransaction> fundTranss = fundTransRepo.findAllByUserId(id);
        fundTranss.forEach((fund)->{
            FundTransRes res = new FundTransRes();
            res.setId(fund.getId());
            res.setRejectedBy(fund.getRejectedBy());
            res.setAlasanRejected(fund.getAlasanRejected());
            res.setTimestamp(fund.getTimestamp());
            res.setBankAccountUser(fund.getBankAccountUser());
            res.setState(fund.getState());
            res.setTotalFundUser(fund.getTotalFundUser());
            res.setTotalFundVendor(fund.getTotalFundVendor());
            res.setTfUser(fund.getTfUser());
            res.setTfVendor(fund.getTfVendor());
            res.setTransaction(transactionRepo.findById(fund.getTransId()).get());
            funds.add(res);
        });
        try{
            resp.setFundTransactions(funds);
            resp.setMessage("Success Get All Refund Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes getAllRefundTransByVendor(Integer id){
        TransRes resp = new TransRes();	
        List<FundTransRes> funds = new ArrayList<FundTransRes>();
        List<FundTransaction> fundTranss = fundTransRepo.findAllByVendorId(id);
        fundTranss.forEach((fund)->{
            FundTransRes res = new FundTransRes();
            res.setId(fund.getId());
            res.setRejectedBy(fund.getRejectedBy());
            res.setAlasanRejected(fund.getAlasanRejected());
            res.setTimestamp(fund.getTimestamp());
            res.setBankAccountUser(fund.getBankAccountUser());
            res.setState(fund.getState());
            res.setTotalFundUser(fund.getTotalFundUser());
            res.setTotalFundVendor(fund.getTotalFundVendor());
            res.setTfUser(fund.getTfUser());
            res.setTfVendor(fund.getTfVendor());
            res.setTransaction(transactionRepo.findById(fund.getTransId()).get());
            funds.add(res);
        });
        try{
            resp.setFundTransactions(funds);
            resp.setMessage("Success Get All Refund Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public TransRes updateRefund(FundTransRes request){
        TransRes resp = new TransRes();	
        fundTransRepo.findById(request.getId()).ifPresentOrElse((fund)->{
            fund.setTfUser(request.getTfUser());
            fund.setTfVendor(request.getTfVendor());
            fund.setState("COMPLETED");
            fundTransRepo.save(fund);
            String messageUser = "You have received a refund for your order #"+ transactionRepo.findById(fund.getTransId()).get().getInvoice() +".Please check the details in the Refund feature. If there are problems, please contact EONITE. Thank You!";
            String messageVendor = "You have received a payment for your order #"+ transactionRepo.findById(fund.getTransId()).get().getInvoice() +".Please check the details in the Payment feature. If there are problems, please contact EONITE. Thank You!";
            try {
                if(fund.getTotalFundUser() > 0) sendEmailOrder(transactionRepo.findById(fund.getTransId()).get().getUser().getEmail(),messageUser,transactionRepo.findById(fund.getTransId()).get().getUser().getFirstName()+" "+transactionRepo.findById(fund.getTransId()).get().getUser().getLastName());
                if(fund.getTotalFundVendor() > 0) sendEmailOrder(transactionRepo.findById(fund.getTransId()).get().getVendor().getEmail(),messageVendor,transactionRepo.findById(fund.getTransId()).get().getVendor().getUsernameVendor());
            } catch (MessagingException e) {}
        },null);
        
        try{
            resp.setMessage("Success Update Refund Transaction");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public DashboardRes getDashboard(Integer id){
        DashboardRes resp = new DashboardRes();
        resp.setTotalProduct(productRepo.countProduct(id));
        resp.setTotalRequest(transactionRepo.countRequestTransaction(id));
        resp.setTotalReview(productRepo.countProductReview(id));
        List<Long> cancelled = new ArrayList<Long>();
        List<Long> completed = new ArrayList<Long>();
        for(int i = 1; i <=6; i++){
            cancelled.add(transactionRepo.countTransactionCancelled(id, i));
            completed.add(transactionRepo.countTransactionCompleted(id, i));
        }
        resp.setOrderCancelled(cancelled);
        resp.setOrderCompleted(completed);
        try{
            resp.setMessage("Success Get Dashboard Information");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    @Scheduled(fixedRate = 60000)
    public void killOrder()throws MessagingException {
        transactionRepo.findAll().forEach((trans)->{
            if(trans.getState().equals("WAITING-PAYMENT") && paymentRepo.findByTransactionId(trans.getId()).get().getState().equals("NONE")){
                String dateString = trans.getTransdate().toString();
                Date today = new Date();
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
                Date inputDate = null;
                try {
                    inputDate = dateFormat.parse(dateString);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                long differenceInMillis = today.getTime() - inputDate.getTime();
                long differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);
                if(differenceInDays == 1){
                    transactionRepo.findById(trans.getId()).ifPresentOrElse((trx)->{
                        trx.setState("CANCELLED");
                        transactionRepo.save(trx);
                        String messageUser = "Sorry, your order #"+ trx.getInvoice() +" has been canceled because you have passed the payment expiration date. We value your business and look forward to serving you again.Thank You!";
                        String messageVendor = "Sorry, your order #"+ trx.getInvoice() +" has been canceled because user have passed the payment expiration date.. We value your business and look forward to serving you again.Thank You!";
                        try {
                            sendEmailOrder(trx.getUser().getEmail(),messageUser,trx.getUser().getFirstName()+" "+trx.getUser().getLastName());
                            sendEmailOrder(trx.getVendor().getEmail(),messageVendor,trx.getVendor().getUsernameVendor());
                        } catch (MessagingException e) {}
                    },null);
                }
            }
        });
    }

}
