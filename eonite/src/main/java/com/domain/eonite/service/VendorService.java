package com.domain.eonite.service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
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

    public VendorRes getAllVendor(String sortBy, String sortDir, Boolean pagination, Integer pageSize, Integer pageIndex, String search, String categoryId,Integer domicileId,Integer rating){
        VendorRes resp = new VendorRes();
        Pageable paging;
            if(sortBy != null && sortDir != null){
                Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())?Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                paging = PageRequest.of(pageIndex,pageSize,sort);
            }else paging = PageRequest.of(pageIndex,pageSize);
        
        Specification<Vendor> spec1 = VendorSpecs.vendorsearch(search);
        Specification<Vendor> spec2 = VendorSpecs.vendordomicile(domicileId);
        List<Integer> listCategory = null;
        if(categoryId != null){
            listCategory = Arrays.stream(categoryId.split(",")).map(String::trim).map(Integer::parseInt).collect(Collectors.toList());
        }
        Specification<Vendor> spec3 = VendorSpecs.distinctvendorCategory(listCategory);
        Specification<Vendor> spec4 = VendorSpecs.ratinglessThan(rating);
        List<String> state = new ArrayList<>();
        state.add("PENDING"); state.add("BLOCKED");
        Specification<Vendor> spec5 = VendorSpecs.vendorstatus(state);
        Specification<Vendor> spec = Specification.where(spec1).and(spec2).and(spec3).and(spec4).and(spec5);
        Page<Vendor> allVendor = vendorRepository.findAll(spec,paging);

        try{
            resp.setLength(allVendor.getTotalElements());
            resp.setVendor(allVendor.getContent());
            resp.setMessage("Success Get All Vendor");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

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
            Vendor.setEmail(request.getEmail());
            Vendor.setBankAccount(request.getBankAccount());
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

    public VendorRes getVendorPending(){
        VendorRes res = new VendorRes();
        List<Vendor> lists = vendorRepository.findAllByStatus("PENDING");
        try{
            res.setVendor(lists);
            res.setMessage("Success get All Pending Vendor");
            res.setStatusCode(200);
        }catch(Exception e){
            res.setStatusCode(500);
            res.setError(e.getMessage());
        }
        return res;
    }

    public VendorRes updateVendorState(VendorRes request){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(request.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setStatus(request.getStatus());
            Vendor.setStatus_reject(request.getStatus_reject());
            vendorRepository.save(Vendor);        
                try{
                    resp.setMessage("Success Update State Vendor");
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

    public VendorRes editPhotoId(VendorRes request){
        VendorRes resp =  new VendorRes();
        vendorRepository.findById(request.getId()).ifPresentOrElse((Vendor) ->{
            Vendor.setPhoto_identity(request.getPhoto_identity());
            Vendor.setStatus_reject("");
            vendorRepository.save(Vendor);        
                try{
                    resp.setMessage("Success Update Photo ID Vendor");
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


}
