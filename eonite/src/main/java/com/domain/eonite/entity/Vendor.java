package com.domain.eonite.entity;

import java.sql.Time;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Data
@Entity
@Table(name= "Vendor", 
       uniqueConstraints={
                          @UniqueConstraint(columnNames = "email")
                         }
      )
public class Vendor implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String role;
    private Integer category_id;
    private Integer domicile_id;
    private String first_name;
    private String last_name;
    private Date birth_date;
    private String phone_number;
    private String phone_business;
    private String address;
    private Integer photo_identity;
    private Integer photo_id;
    private String description;
    private String inoperatve_date;
    private String instagram_url;
    private String twitter_url;
    private Integer rating;
    private Integer penalty;
    private String status;
    private Time startTime;
    private Time endTime;
    private String email;
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
    
}
