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
                    if(subject.equals("USER")) helper.setSubject("Anda baru saja melakukan pemesanan [EONITE]");
                    else helper.setSubject("Anda baru saja mendapat pesanan [EONITE]");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
                Context context = new Context();
                if(subject.equals("USER")){
                    context.setVariable("receiver", trans.getUser().getFirstName() +" "+ trans.getUser().getLastName());
                    context.setVariable("message","Terima kasih telah melakukan pemesanan dengan "+trans.getVendor().getUsernameVendor());
                } 
                else{
                    context.setVariable("receiver", trans.getVendor().getUsernameVendor());
                    context.setVariable("message","");
                } 
                context.setVariable("invoice",trans.getInvoice());

                LocalDateTime localDateTime = trans.getTransdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                // DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
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

                BigDecimal amount = new BigDecimal(trans.getTotal().toString()); 
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
                helper.setSubject("Konfirmasi Order [EONITE]");
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
                            String messageUser = "Pesanan Anda "+ trans.getInvoice() +" telah diterima oleh vendor. Silakan lanjutkan pembayaran dengan mengunggah bukti transfer pada halaman detail transaksi. Jika pembayaran belum selesai dalam waktu 24 jam, sistem akan otomatis membatalkan pesanan. Terimakasih!.";
                            String messageVendor = "Terima kasih telah mengkonfirmasi pesanan "+ trans.getInvoice() +". Silakan menunggu pembayaran dari User. Kami akan memberi tahu Anda jika ada pembaruan melalui email ini.";
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
                            String messageUser = "Maaf, pesanan Anda "+ trans.getInvoice() +" telah ditolak oleh vendor. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi. Terima kasih telah menggunakan EONITE.";
                            String messageVendor = "Terima kasih telah mengkonfirmasi pesanan "+ trans.getInvoice() +". Kami akan memberi tahu pengguna bahwa pesanan ini dibatalkan. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi. Terima kasih telah menggunakan EONITE.";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                        FundTransaction fundings = new FundTransaction();
                        fundings.setRejectedBy("VENDOR");
                        fundings.setAlasanRejected(request.getDescription());
                        fundings.setTimestamp(new Date());
                        fundings.setState("COMPLETED");
                        fundings.setTransId(request.getId());
                        fundings.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        fundings.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        fundings.setTotalFundUser(0.0);
                        fundings.setTotalFundVendor(0.0);
                        fundTransRepo.save(fundings);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi. Terima Kasih!";
                            String messageVendor = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi. Terima Kasih!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                        FundTransaction funding = new FundTransaction();
                        funding.setRejectedBy("USER");
                        funding.setAlasanRejected(request.getDescription());
                        funding.setTimestamp(new Date());
                        funding.setState("COMPLETED");
                        funding.setTransId(request.getId());
                        funding.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        funding.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        funding.setTotalFundUser(0.0);
                        funding.setTotalFundVendor(0.0);
                        fundTransRepo.save(funding);
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
                            String messageUser = "Kami telah menerima bukti pembayaran pesanan Anda #"+ trans.getInvoice() +" dan pesanan dapat dilanjutkan ke tahap berikutnya [Sedang Berlangsung]. Terima kasih!";
                            String messageVendor = "Pembeli telah selesai melakukan pembayaran, dan pesanan #"+ trans.getInvoice() +" telah dilanjutkan ke tahap berikutnya [Sedang Berlangsung]. Anda dapat menindaklanjuti pesanan Anda. Terima kasih!";
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
                            String messageUser = "Maaf, bukti pembayaran pesanan Anda #"+ transactionRepo.findById(request.getId()).get().getInvoice() +" ditolak karena "+ request.getDescription() +".Silakan upload kembali bukti pembayaran untuk melanjutkan ke tahap selanjutnya. Terima kasih";
                            try {
                                sendEmailOrder(transactionRepo.findById(request.getId()).get().getUser().getEmail(),messageUser,transactionRepo.findById(request.getId()).get().getUser().getFirstName()+" "+transactionRepo.findById(request.getId()).get().getUser().getLastName());
                            } catch (MessagingException e) {}
                        },null);
                    break;

                    case "CANCEL":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi.Terima kasih!";
                            String messageVendor = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan. Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi.Terima kasih!";
                            try {
                                sendEmailOrder(trans.getUser().getEmail(),messageUser,trans.getUser().getFirstName()+" "+trans.getUser().getLastName());
                                sendEmailOrder(trans.getVendor().getEmail(),messageVendor,trans.getVendor().getUsernameVendor());
                            } catch (MessagingException e) {}
                        },null);
                        FundTransaction fundings = new FundTransaction();
                        fundings.setRejectedBy("USER");
                        fundings.setAlasanRejected(request.getDescription());
                        fundings.setTimestamp(new Date());
                        fundings.setState("COMPLETED");
                        fundings.setTransId(request.getId());
                        fundings.setUserId(transactionRepo.findById(request.getId()).get().getUser().getId());
                        fundings.setVendorId(transactionRepo.findById(request.getId()).get().getVendor().getId());
                        fundings.setTotalFundUser(0.0);
                        fundings.setTotalFundVendor(0.0);
                        fundTransRepo.save(fundings);
                    break;
                }
            break;

            case "ON-GOING":
                switch(request.getAction()){
                    case "CANCEL_USER":
                        transactionRepo.findById(request.getId()).ifPresentOrElse((trans)->{
                            trans.setState("CANCELLED");
                            transactionRepo.save(trans);
                            String messageUser = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan oleh "+trans.getUser().getFirstName()+" "+trans.getUser().getLastName() +" karena "+ request.getDescription() +". Kami akan mengembalikan pembayaran yang dilakukan sesuai dengan peraturan dan ketentuan EONITE. Anda dapat mengecek pengembalian pembayaran Anda secara berkala pada fitur Pengembalian Dana. Terima kasih!";
                            String messageVendor = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan oleh "+trans.getUser().getFirstName()+" "+trans.getUser().getLastName() +" karena "+ request.getDescription() +". Kami akan mentransfer dana kepada Anda sesuai dengan peraturan dan ketentuan EONITE. Anda dapat memeriksa pembayaran Anda secara berkala di fitur Pembayaran. Terima kasih!";
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
                            funding.setBankNameUser(payment.getBankName());
                            funding.setBankTypeUser(payment.getBankType());
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
                            String messageUser = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan oleh "+trans.getVendor().getUsernameVendor() +" karena "+ request.getDescription() +". Kami akan mengembalikan pembayaran yang dilakukan sesuai dengan peraturan dan ketentuan EONITE. Anda dapat mengecek pengembalian pengembalian dana Anda secara berkala pada fitur Pengembalian Dana. Terima kasih!";
                            String messageVendor = "Maaf, pesanan Anda #"+ trans.getInvoice() +" telah dibatalkan oleh "+trans.getVendor().getUsernameVendor() +" karena "+ request.getDescription() +". Kami akan mentransfer dana kepada Anda sesuai dengan peraturan dan ketentuan EONITE. Anda dapat memeriksa pembayaran Anda secara berkala di fitur Pembayaran. Terima kasih!";
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
                            fundings.setBankNameUser(payment.getBankName());
                            fundings.setBankTypeUser(payment.getBankType());
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
                            String messageUser = "Selamat! Anda telah menyelesaikan pesanan Anda #"+ trans.getInvoice() +". Terima kasih telah bertransaksi menggunakan EONITE. Anda dapat memberikan saran dan masukan pada halaman Detail Transaksi. Hubungi EONITE jika Anda mengalami kesulitan. Terima kasih!";
                            String messageVendor = "Selamat! Anda telah menyelesaikan pesanan Anda #"+ trans.getInvoice() +". Kami akan segera memproses pembayaran Anda. Silakan periksa fitur pembayaran secara berkala. Terima kasih!";
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
                            fundings2.setBankNameUser(payment.getBankName());
                            fundings2.setBankTypeUser(payment.getBankType());
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
            payment.setBankName(request.getBankName());
            payment.setBankType(request.getBankType());
            paymentRepo.save(payment);
            String messageUser = "Anda baru saja mengunggah bukti pembayaran untuk Nomor Faktur #"+ transactionRepo.findById(request.getTransId()).get().getInvoice() +". Mohon menunggu konfirmasi dari kami untuk tahap selanjutnya. Kami sedang memproses pembayaran Anda. Terima kasih!";
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
        List<FundTransaction> funds = fundTransRepo.findByTransId(id);
        try{
            resp.setFund(funds);
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
        if(state.equals("ALL")) trans = transactionRepo.findByUserIdAndOrderByTransdateAsc(id);
        else trans = transactionRepo.findByUserAndState(id,state);
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
        if(state.equals("ALL")) trans = transactionRepo.findByVendorIdAndOrderByTransdateAsc(id);
        else trans = transactionRepo.findByVendorAndState(id,state);
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
            res.setBankNameUser(fund.getBankNameUser());
            res.setBankTypeUser(fund.getBankTypeUser());
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
            res.setBankNameUser(fund.getBankNameUser());
            res.setBankTypeUser(fund.getBankTypeUser());
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
            res.setBankNameUser(fund.getBankNameUser());
            res.setBankTypeUser(fund.getBankTypeUser());
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
            String messageUser = "Anda telah menerima pengembalian dana untuk Nomor Faktur #"+ transactionRepo.findById(fund.getTransId()).get().getInvoice() +".Silakan periksa detailnya di fitur Pengembalian Dana. Jika ada kendala silahkan menghubungi EONITE. Terima kasih!";
            String messageVendor = "Anda telah menerima pembayaran untuk Nomor Faktur #"+ transactionRepo.findById(fund.getTransId()).get().getInvoice() +".Silakan periksa detailnya di fitur Pembayaran. Jika ada kendala silahkan menghubungi EONITE. Terima kasih!";
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

    // CHECK PAYMENT 
    @Scheduled(fixedRate = 43200000)
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
                        String messageUser = "Maaf, pesanan Anda #"+ trx.getInvoice() +" telah dibatalkan karena Anda telah melewati tanggal kedaluwarsa pembayaran. Terima Kasih!";
                        String messageVendor = "Maaf, pesanan Anda #"+ trx.getInvoice() +" telah dibatalkan karena User telah melewati tanggal kedaluwarsa pembayaran. Terima Kasih!";
                        try {
                            sendEmailOrder(trx.getUser().getEmail(),messageUser,trx.getUser().getFirstName()+" "+trx.getUser().getLastName());
                            sendEmailOrder(trx.getVendor().getEmail(),messageVendor,trx.getVendor().getUsernameVendor());
                        } catch (MessagingException e) {}
                    },null);
                }
            }
        });
    }

    // CHECK CONFIRMATION
    @Scheduled(fixedRate = 43200000)
    public void killOrderCONFIRMED()throws MessagingException {
        transactionRepo.findAll().forEach((trans)->{
            if(trans.getState().equals("WAITING-CONFIRMATION")){
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
                        String messageUser = "Maaf, pesanan Anda #"+ trx.getInvoice() +" telah dibatalkan karena Vendor tidak mengkonfirmasi pesanan dalam waktu 24 jam. Terima Kasih!";
                        String messageVendor = "Maaf, pesanan Anda #"+ trx.getInvoice() +" telah dibatalkan karena Anda tidak mengkonfirmasi pesanan dalam waktu 24 jam. Terima Kasih!";
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
