package com.domain.eonite.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        try{
            Users users = userRepository.findById(id).get();
            List<Users> userList = new ArrayList<Users>();
            userList.add(users);
            resp.setUsers(userList);
            resp.setMessage("Get Profile User");
            resp.setStatusCode(200);
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public UserRes editProfile(Users registrationRequest){
        UserRes resp =  new UserRes();
        userRepository.findById(registrationRequest.getId()).ifPresentOrElse((users) ->{
            users.setFirstName(registrationRequest.getFirstName());
            users.setLastName(registrationRequest.getLastName());
            users.setBirthDate(registrationRequest.getBirthDate());
            users.setPhoneNumber(registrationRequest.getPhoneNumber());
            users.setPhoto(registrationRequest.getPhoto());
            userRepository.findByEmail(registrationRequest.getEmail()).ifPresentOrElse((email)->{
                if(email.getId().equals(registrationRequest.getId())){
                    users.setEmail(registrationRequest.getEmail());
                    userRepository.save(users);
                    List<Users> usersList = new ArrayList<Users>();
                    usersList.add(users);
                    try{
                        resp.setUsers(usersList);
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
                users.setEmail(registrationRequest.getEmail());
                userRepository.save(users);
                List<Users> usersList = new ArrayList<Users>();
                usersList.add(users);
                try{
                    resp.setUsers(usersList);
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

    public UserRes checkPassword(Users registrationRequest){
        UserRes resp =  new UserRes();
        userRepository.findById(registrationRequest.getId()).ifPresentOrElse((users) ->{
            PasswordEncoder passencoder = new BCryptPasswordEncoder();
            String encodedPassword = users.getPassword();
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
            resp.setError("User not found");
        });
        return resp;
    }

    public UserRes changePassword(Users registrationRequest){
        UserRes resp =  new UserRes();
        PasswordEncoder passencoder = new BCryptPasswordEncoder();
        userRepository.findById(registrationRequest.getId()).ifPresentOrElse((users) ->{
            users.setPassword(passencoder.encode(registrationRequest.getPassword()));
            userRepository.save(users);
            List<Users> usersList = new ArrayList<Users>();
            usersList.add(users);
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
            resp.setError("User not found");
        });
        return resp;
    }
}
