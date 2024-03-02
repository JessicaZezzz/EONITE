package com.domain.eonite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.domain.eonite.repository.UserRepo;
import com.domain.eonite.repository.VendorRepo;

@Service
public class OurUserDetailsService implements UserDetailsService{

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VendorRepo vendorRepo;
    

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if(userRepo.findByEmail(username).isPresent()) {
            return userRepo.findByEmail(username).orElseThrow();
        }else{
            return vendorRepo.findByEmail(username).orElseThrow();
        }
    }
    
}
