package com.domain.eonite.service;
import java.io.InputStream;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.domain.eonite.dto.TokenRes;
import com.domain.eonite.entity.ConfirmationToken;
import com.domain.eonite.repository.ConfirmationTokenRepository;
import com.domain.eonite.repository.UserRepo;
import com.domain.eonite.repository.VendorRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.file.Path;
import jakarta.transaction.Transactional;
import org.springframework.core.io.Resource;
import org.apache.commons.io.IOUtils;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.Random;

@Service
@Transactional
public class EmailService {
    private static final long OTP_EXPIRATION_MINUTES = 300;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private VendorRepo vendorRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private String ConfirmToken;

    public TokenRes generateOTP(TokenRes generateOTPRequest)throws MessagingException {
        TokenRes token = new TokenRes();
        confirmationTokenRepository.findByUserTypeAndEmail(generateOTPRequest.getUserType(), generateOTPRequest.getEmail()).ifPresentOrElse((tk)->{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
            LocalDateTime tokenGeneratedTime = LocalDateTime.parse(tk.getCreatedDate().toString(),formatter);
            boolean isExpired = isOTPExpired(tokenGeneratedTime);
            if(isExpired){
                Random random = new Random();
                int otpValue = 100_000 + random.nextInt(900_000);
                String otp = String.valueOf(otpValue);
            tk.setConfirmationToken(otp);
            tk.setCreatedDate(new Date());
            ConfirmToken = otp;
            confirmationTokenRepository.save(tk);
            }else ConfirmToken = tk.getConfirmationToken();
        },()->{
            ConfirmationToken ct = new ConfirmationToken();
            ct.setCreatedDate(new Date());
            ct.setUserType(generateOTPRequest.getUserType());
            ct.setEmail(generateOTPRequest.getEmail());
                Random random = new Random();
                int otpValue = 100_000 + random.nextInt(900_000);
                String otp = String.valueOf(otpValue);
            ct.setConfirmationToken(otp);
            confirmationTokenRepository.save(ct);
            ConfirmToken = otp;
        });
        
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setTo(generateOTPRequest.getEmail());
            helper.setSubject("Verifikasi Akun Anda [EONITE]");
            Context context = new Context();
            context.setVariable("otp", ConfirmToken);
            String htmlContent = templateEngine.process("generateotp", context);
            helper.setText(htmlContent,true);
            javaMailSender.send(msg);
        try{
            token.setStatusCode(200);
            token.setMessage("Success send OTP to Email");
        }catch(Exception e){
            token.setStatusCode(500);
            token.setError("Failed send OTP to Email. Please try again");
        }
        return token; 
    }

    public TokenRes generateOTPlogin(TokenRes generateOTPRequest)throws MessagingException {
        TokenRes token = new TokenRes();
        confirmationTokenRepository.findByUserTypeAndEmail(generateOTPRequest.getUserType(), generateOTPRequest.getEmail()).ifPresentOrElse((tk)->{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
            LocalDateTime tokenGeneratedTime = LocalDateTime.parse(tk.getCreatedDate().toString(),formatter);
            boolean isExpired = isOTPExpired(tokenGeneratedTime);
            if(isExpired){
                Random random = new Random();
                int otpValue = 100_000 + random.nextInt(900_000);
                String otp = String.valueOf(otpValue);
            tk.setConfirmationToken(otp);
            tk.setCreatedDate(new Date());
            ConfirmToken = otp;
            confirmationTokenRepository.save(tk);
            }else ConfirmToken = tk.getConfirmationToken();
        },()->{
            ConfirmationToken ct = new ConfirmationToken();
            ct.setCreatedDate(new Date());
            ct.setUserType(generateOTPRequest.getUserType());
            ct.setEmail(generateOTPRequest.getEmail());
                Random random = new Random();
                int otpValue = 100_000 + random.nextInt(900_000);
                String otp = String.valueOf(otpValue);
            ct.setConfirmationToken(otp);
            confirmationTokenRepository.save(ct);
            ConfirmToken = otp;
        });
        
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	        helper.setTo(generateOTPRequest.getEmail());
	        helper.setSubject("Verifikasi Akun Anda [EONITE]");
            Context context = new Context();
            context.setVariable("otp", ConfirmToken);
            String htmlContent = templateEngine.process("generateotplogin", context);
            helper.setText(htmlContent,true);
            javaMailSender.send(msg);
        try{
            token.setStatusCode(200);
            token.setMessage("Success send OTP to Email");
        }catch(Exception e){
            token.setStatusCode(500);
            token.setError("Failed send OTP to Email. Please try again");
        }
        return token; 
    }

    public TokenRes checkOTP(TokenRes generateOTPRequest){
        TokenRes token = new TokenRes();
        confirmationTokenRepository.findByUserTypeAndEmail(generateOTPRequest.getUserType(), generateOTPRequest.getEmail()).ifPresentOrElse((tk)->{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
            LocalDateTime tokenGeneratedTime = LocalDateTime.parse(tk.getCreatedDate().toString(),formatter);
            boolean isExpired = isOTPExpired(tokenGeneratedTime);
            if(!isExpired){
                if(tk.getConfirmationToken().equals(generateOTPRequest.getConfirmationToken())){
                    confirmationTokenRepository.deleteById(tk.getTokenId());
                    token.setStatusCode(200);
                    token.setMessage("OTP Matched");
                }else{
                    token.setStatusCode(500);
                    token.setError("OTP Salah! Silahkan coba lagi");
                }
            }else{
                token.setStatusCode(500);
                token.setError("OTP telah kadaluwarsa");
            }
        },()->{
            token.setStatusCode(500);
            token.setError("User tidak ditemukan");
        });
        return token; 
    }

    public static boolean isOTPExpired(LocalDateTime generatedTime) {
        LocalDateTime currentTime = LocalDateTime.now();
        Duration duration = Duration.between(generatedTime, currentTime);
        long minutesPassed = duration.toSeconds();

        return minutesPassed >= OTP_EXPIRATION_MINUTES;
    }

    public TokenRes resetPassword(TokenRes generateOTPRequest) throws MessagingException{
        TokenRes token = new TokenRes();
        if(generateOTPRequest.getUserType().equals("USER")){
            String newPassword = generateRandomPassword();
            String encodedPassword = passwordEncoder.encode(newPassword);
            userRepo.findByEmail(generateOTPRequest.getEmail()).ifPresentOrElse((user)->{
                user.setPassword(encodedPassword);
                userRepo.save(user);
                try {
                    sendEmailReset(generateOTPRequest.getEmail(), newPassword);
                    token.setStatusCode(200);
                    token.setMessage("Berhasil mengirim kata sandi sementara ke email");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            },()->{
                token.setStatusCode(500);
                token.setError("Email tidak ditemukan. Gagal mengatur ulang kata sandi");
            });
        }else if(generateOTPRequest.getUserType().equals("VENDOR")){
            String newPassword = generateRandomPassword();
            String encodedPassword = passwordEncoder.encode(newPassword);
            vendorRepo.findByEmail(generateOTPRequest.getEmail()).ifPresentOrElse((vendor)->{
                vendor.setPassword(encodedPassword);
                vendorRepo.save(vendor);
                try {
                    sendEmailReset(generateOTPRequest.getEmail(), newPassword);
                    token.setStatusCode(200);
                    token.setMessage("Berhasil mengirim kata sandi sementara ke email");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            },()->{
                token.setStatusCode(500);
                token.setError("Email tidak ditemukan. Gagal mengatur ulang kata sandi");
            });
        }
        return token; 
    }

    public void sendEmailReset(String email, String password) throws MessagingException{
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
	        helper.setTo(email);
	        helper.setSubject("Atur Ulang Kata Sandi Akun Anda [EONITE]");
            Context context = new Context();
            context.setVariable("email", email);
            context.setVariable("password", password);
            String htmlContent = templateEngine.process("resetpassword", context);
            helper.setText(htmlContent,true);
            javaMailSender.send(msg);
    }

    private String generateRandomPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 12; i++) { // Change 12 to the desired length of the password
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }
        return password.toString();
    }

    private String convertToBase64(Path path) {
        // Path path = Paths.get("src/main/resources/static/logo-modified.png");
        //     String base64Image = convertToBase64(path);
        //     String image = "data:image/png;base64, " + base64Image;
        //     context.setVariable("image",  image);
        byte[] imageAsBytes = new byte[0];
        try {
        Resource resource = new UrlResource(path.toUri());
        InputStream inputStream = resource.getInputStream();
        imageAsBytes = IOUtils.toByteArray(inputStream);

        } catch (IOException e) {
        System.out.println("\n File read Exception");
        }

        return Base64.getEncoder().encodeToString(imageAsBytes);
    }

}
