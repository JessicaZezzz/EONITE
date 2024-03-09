package com.domain.eonite.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.UserRes;
import com.domain.eonite.entity.Users;
import com.domain.eonite.repository.UserRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepo userRepository;

    public UserRes getAllUser(String searchBy, String searchParam, String sortBy, String sortDir, Boolean pagination, Integer pageSize, Integer pageIndex){
        UserRes resp =  new UserRes();

        Pageable paging;
            if(sortBy != null && sortDir != null){
                Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())?Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                paging = PageRequest.of(pageIndex,pageSize,sort);
            }else paging = PageRequest.of(pageIndex,pageSize);

        String firstname = null;
        String lastname = null;
        String email = null;
        String phonenumber = null;
        if(searchBy != null){
            if(searchBy.equals("first_name")){
                firstname = searchBy;
            }else if(searchBy.equals("last_name")){
                lastname = searchBy;
            }else if(searchBy.equals("email")){
                email = searchBy;
            }else if(searchBy.equals("phone_number")){
                phonenumber = searchBy;
            }
        }
        Page<Users> allUsers = userRepository.findAll("USER",firstname,lastname,email,phonenumber,searchParam,paging);

        try{
            resp.setLength(allUsers.getTotalElements());
            resp.setUsers(allUsers.getContent());
            resp.setMessage("Get All Users");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public UserRes getProfileUser(Integer id){
        UserRes resp =  new UserRes();
        Users users = userRepository.findById(id);
        try{
            resp.setUsers(users.toList());
            resp.setMessage("Get All Users");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }
}
