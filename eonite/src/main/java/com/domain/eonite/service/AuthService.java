package com.domain.eonite.service;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.ReqRes;
import com.domain.eonite.dto.UserRes;
import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.entity.Users;
import com.domain.eonite.entity.Vendor;
import com.domain.eonite.repository.UserRepo;
import com.domain.eonite.repository.VendorRepo;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VendorRepo vendorRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Optional<Users> findByEmailUser(String email){
        return userRepo.findByEmail(email);
    }

    public Optional<Vendor> findByEmailVendor(String email){
        return vendorRepo.findByEmail(email);
    }

    public UserRes signUpUser(UserRes registrationRequest){
        UserRes resp =  new UserRes();
        try{
            Users users = new Users();
            users.setFirst_name(registrationRequest.getFirst_name());
            users.setLast_name(registrationRequest.getLast_name());
            users.setBirth_date(registrationRequest.getBirth_date());
            users.setPhone_number(registrationRequest.getPhone_number());
            users.setPhoto_id(registrationRequest.getPhoto_id());
            users.setEmail(registrationRequest.getEmail());
            users.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            users.setRole(registrationRequest.getRole());
            Users userResult =  userRepo.save(users);
            if(userResult != null && userResult.getId()>0){
                resp.setUsers(userResult);
                resp.setMessage("User saved successfully");
                resp.setStatusCode(200);
            }
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public VendorRes signUpVendor(VendorRes registrationRequest){
        VendorRes resp =  new VendorRes();
        try{
            Vendor vendors = new Vendor();
            vendors.setCategory_id(registrationRequest.getCategory_id());
            vendors.setDomicile_id(registrationRequest.getDomicile_id());
            vendors.setFirst_name(registrationRequest.getFirst_name());
            vendors.setLast_name(registrationRequest.getLast_name());
            vendors.setBirth_date(registrationRequest.getBirth_date());
            vendors.setPhone_number(registrationRequest.getPhone_number());
            vendors.setPhone_business(registrationRequest.getPhone_business());
            vendors.setAddress(registrationRequest.getAddress());
            vendors.setPhoto_identity(registrationRequest.getPhoto_identity());
            vendors.setPhoto_id(null);
            vendors.setDescription(null);
            vendors.setInoperatve_date(null);
            vendors.setInstagram_url(null);
            vendors.setTwitter_url(null);
            vendors.setRating(0);
            vendors.setPenalty(0);
            vendors.setStatus(registrationRequest.getStatus());
            vendors.setStartTime(registrationRequest.getStartTime());
            vendors.setEndTime(registrationRequest.getEndTime());
            vendors.setEmail(registrationRequest.getEmail());
            vendors.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            vendors.setRole(registrationRequest.getRole());
            Vendor vendorResult =  vendorRepo.save(vendors);
            if(vendorResult != null && vendorResult.getId()>0){
                resp.setVendor(vendorResult);
                resp.setMessage("Vendor saved successfully");
                resp.setStatusCode(200);
            }
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes signInUser(ReqRes signInRequest){
        ReqRes response = new ReqRes();
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),signInRequest.getPassword())); 
                var user = userRepo.findByEmail(signInRequest.getEmail()).orElseThrow();
                var jwt = jwtUtils.generateToken(user);
                var resfreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
                response.setStatusCode(200);
                response.setId(user.getId());
                response.setToken(jwt);
                response.setRefreshToken(resfreshToken);
                response.setExpirationTime("24 hr");
                response.setMessage("Successfully Signed In");
        }catch(Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
            System.err.println(signInRequest.getRole());
        }
        return response;
    }

    public ReqRes signInVendor(ReqRes signInRequest){
        ReqRes response = new ReqRes();
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),signInRequest.getPassword()));
            var vendor = vendorRepo.findByEmail(signInRequest.getEmail()).orElseThrow();
            System.out.println("VENDOR IS: "+ vendor);
            var jwt = jwtUtils.generateToken(vendor);
            var resfreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), vendor);
            response.setStatusCode(200);
            response.setId(vendor.getId());
            response.setToken(jwt);
            response.setRefreshToken(resfreshToken);
            response.setExpirationTime("24 hr");
            response.setMessage("Successfully Signed In");
        }catch(Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }
    
    public ReqRes refreshToken(ReqRes refreshTokenRequest){
        ReqRes response = new ReqRes();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            Users users = userRepo.findByEmail(ourEmail).orElseThrow();
            if(jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)){
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24 hr");
                response.setMessage("Successfully Refreshed Token");
        }
        }catch(Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
        
        return response;
    }
}
