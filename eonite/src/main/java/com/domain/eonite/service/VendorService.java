package com.domain.eonite.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.VendorRes;
import com.domain.eonite.entity.Vendor;
import com.domain.eonite.repository.VendorRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class VendorService {
    @Autowired
    private VendorRepo vendorRepository;

    // public VendorRes getAllUser(String searchBy, String searchParam, String sortBy, String sortDir, Boolean pagination, Integer pageSize, Integer pageIndex){
    //     VendorRes resp =  new VendorRes();

    //     Pageable paging;
    //         if(sortBy != null && sortDir != null){
    //             Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())?Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    //             paging = PageRequest.of(pageIndex,pageSize,sort);
    //         }else paging = PageRequest.of(pageIndex,pageSize);

    //     String firstname = null;
    //     String lastname = null;
    //     String email = null;
    //     String phonenumber = null;
    //     if(searchBy != null){
    //         if(searchBy.equals("first_name")){
    //             firstname = searchBy;
    //         }else if(searchBy.equals("last_name")){
    //             lastname = searchBy;
    //         }else if(searchBy.equals("email")){
    //             email = searchBy;
    //         }else if(searchBy.equals("phone_number")){
    //             phonenumber = searchBy;
    //         }
    //     }
    //     Page<Vendor> allVendor = vendorRepository.findAll("USER",firstname,lastname,email,phonenumber,searchParam,paging);

    //     try{
    //         resp.setLength(allVendor.getTotalElements());
    //         resp.setVendor(allVendor.getContent());
    //         resp.setMessage("Get All Vendor");
    //         resp.setStatusCode(200);
    //     }catch(Exception e){
    //         resp.setStatusCode(500);
    //         resp.setError(e.getMessage());
    //     }
    //     return resp;
    // }

    public VendorRes getProfileVendor(Integer id){
        VendorRes resp =  new VendorRes();
        try{
            Vendor Vendor = vendorRepository.findById(id).get();
            List<Vendor> userList = new ArrayList<Vendor>();
            userList.add(Vendor);
            resp.setVendor(userList);
            resp.setMessage("Get Profile Vendor");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public VendorRes editProfile(Vendor registrationRequest){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(registrationRequest.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setFirstName(registrationRequest.getFirstName());
            Vendor.setLastName(registrationRequest.getLastName());
            Vendor.setBirthDate(registrationRequest.getBirthDate());
            Vendor.setPhoneNumber(registrationRequest.getPhoneNumber());
            Vendor.setPhoto(registrationRequest.getPhoto());
            vendorRepository.findByEmail(registrationRequest.getEmail()).ifPresentOrElse((email)->{
                if(email.getId().equals(registrationRequest.getId())){
                    Vendor.setEmail(registrationRequest.getEmail());
                    vendorRepository.save(Vendor);
                    List<Vendor> VendorList = new ArrayList<Vendor>();
                    VendorList.add(Vendor);
                    try{
                        resp.setVendor(VendorList);
                        resp.setMessage("Success Update Profile User");
                        resp.setStatusCode(200);
            
                    }catch(Exception e){
                        resp.setStatusCode(500);
                        resp.setError(e.getMessage());
                    }
                }else{
                    resp.setStatusCode(500);
                    resp.setError("Sorry, Email already taken");
                }
            }, ()->{
                Vendor.setEmail(registrationRequest.getEmail());
                vendorRepository.save(Vendor);
                List<Vendor> VendorList = new ArrayList<Vendor>();
                VendorList.add(Vendor);
                try{
                    resp.setVendor(VendorList);
                    resp.setMessage("Success Update Profile User");
                    resp.setStatusCode(200);
        
                }catch(Exception e){
                    resp.setStatusCode(500);
                    resp.setError(e.getMessage());
                }
            });
        },
        ()->{
            resp.setStatusCode(500);
            resp.setError("User not found");
        });
        return resp;
    }

    public VendorRes checkPassword(Vendor registrationRequest){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(registrationRequest.getId()).ifPresentOrElse((Vendor) ->{
            PasswordEncoder passencoder = new BCryptPasswordEncoder();
            String encodedPassword = Vendor.getPassword();
            if(passencoder.matches(registrationRequest.getPassword(), encodedPassword)){
                resp.setStatusCode(200);
                resp.setMessage("Password Match!");
            }else{
                resp.setStatusCode(500);
                resp.setError("Password not match!");
            }
        },
        ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor not found");
        });
        return resp;
    }

    public VendorRes changePassword(Vendor registrationRequest){
        VendorRes resp =  new VendorRes();
        PasswordEncoder passencoder = new BCryptPasswordEncoder();
        vendorRepository.findById(registrationRequest.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setPassword(passencoder.encode(registrationRequest.getPassword()));
            vendorRepository.save(Vendor);
            List<Vendor> VendorList = new ArrayList<Vendor>();
            VendorList.add(Vendor);
            try{
                resp.setMessage("Success Update Password");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        },
        ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor not found");
        });
        return resp;
    }
}
