package com.domain.eonite.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.*;
import com.domain.eonite.entity.*;
import com.domain.eonite.repository.*;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class VendorService {
    @Autowired
    private VendorRepo vendorRepository;

    @Autowired
    private CategoryVendorRepo categoryVendorRepository;

    @Autowired
    private SubCategoryRepo subCategoryRepo;

    @Autowired
    private BankAccountRepo bankAccountRepo;

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

    public VendorRes editProfile(VendorRes request){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(request.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setFirstName(request.getFirstName());
            Vendor.setLastName(request.getLastName());
            Vendor.setBirthDate(request.getBirthDate());
            Vendor.setPhoneNumber(request.getPhoneNumber());
            Vendor.setUsernameVendor(request.getUsernameVendor());
            Vendor.setStartTime(request.getStartTime());
            Vendor.setEndTime(request.getEndTime());
            Vendor.setAddress(request.getAddress());
            Vendor.setDescription(request.getDescription());
            Vendor.setDomicile_id(request.getDomicile_id());
            Vendor.setPhoto(request.getPhoto());
            Vendor.setPhoneBusiness(request.getPhoneBusiness());
            Vendor.setInstagram_url(request.getInstagram_url());
            Vendor.setInoperative_date(request.getInoperative_date());
            Vendor.setEmail(request.getEmail());
                Vendor vendorResult = vendorRepository.save(Vendor);
                List<Vendor> VendorList = new ArrayList<Vendor>();
                VendorList.add(Vendor);
                categoryVendorRepository.deleteCategoryVendor(request.getId());

                for(Integer index : categoryVendorRepository.findByVendorId(request.getId())){
                    categoryVendorRepository.deleteById(index);
                }

                List<Integer> subcategories = request.getSubCategory();
                for(Integer index : subcategories){
                    CategoryVendor categoryVendor = new CategoryVendor();
                    SubCategory sub = subCategoryRepo.findById(index).get();
                    categoryVendor.setSubcategory(sub);
                    categoryVendor.setVendor(vendorResult);
                    categoryVendorRepository.save(categoryVendor);
                }

                try{
                    resp.setVendor(VendorList);
                    resp.setMessage("Success Update Profile Vendor");
                    resp.setStatusCode(200);
        
                }catch(Exception e){
                    resp.setStatusCode(500);
                    resp.setError(e.getMessage());
                }
        },()->{
            resp.setStatusCode(500);
            resp.setError("Vendor not found");
        });
        return resp;
    }

    public VendorRes checkPassword(Vendor request){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(request.getId()).ifPresentOrElse((Vendor) ->{
            PasswordEncoder passencoder = new BCryptPasswordEncoder();
            String encodedPassword = Vendor.getPassword();
            if(passencoder.matches(request.getPassword(), encodedPassword)){
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

    public VendorRes changePassword(Vendor request){
        VendorRes resp =  new VendorRes();
        PasswordEncoder passencoder = new BCryptPasswordEncoder();
        vendorRepository.findById(request.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setPassword(passencoder.encode(request.getPassword()));
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

    public BankRes addBankAccount(BankRes request){
        BankRes resp =  new BankRes();
        vendorRepository.findById(request.getVendorid()).ifPresentOrElse((Vendor)->{
            BankAccount bankacc = new BankAccount();
            bankacc.setIdbank(request.getIdbank());
            bankacc.setNoAccount(request.getNoAccount());
            bankacc.setVendor(Vendor);
            bankAccountRepo.save(bankacc);

            try{
                resp.setMessage("Success Add Bank Account");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor Not Found");
        });
        return resp;
    }

    public BankRes updateBankAccount(BankRes request){
        BankRes resp =  new BankRes();
        vendorRepository.findById(request.getVendorid()).ifPresentOrElse((Vendor)->{
            bankAccountRepo.findById(request.getId()).ifPresentOrElse((BankAccount)->{
                BankAccount.setIdbank(request.getIdbank());
                BankAccount.setNoAccount(request.getNoAccount());
                BankAccount.setVendor(Vendor);
                bankAccountRepo.save(BankAccount);
            },()->{});
            
            try{
                resp.setMessage("Success Update Bank Account");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor Not Found");
        });
        return resp;
    }

    public BankRes getBankAccount(Integer id){
        BankRes resp =  new BankRes();
        vendorRepository.findById(id).ifPresentOrElse((Vendor)->{
            List<BankAccount> bankAcc = bankAccountRepo.getBankAccount(id);
            try{
                resp.setBankAccounts(bankAcc);
                resp.setMessage("Success Get Bank Account for Vendor Id " + id);
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Vendor Not Found");
        });
        return resp;
    }

    public BankRes deleteBankAccount(Integer id){
        BankRes resp =  new BankRes();
        bankAccountRepo.findById(id).ifPresentOrElse((bankacc)->{
            bankAccountRepo.deleteBankAccount(id);
            try{
                resp.setMessage("Success Delete Bank Account for Id " + id);
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Bank Account Not Found");
        });
        return resp;
    }
}
