package com.domain.eonite.entity;

import java.sql.*;
import java.util.Collection;
import java.util.List;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.*;

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
    private Integer domicile_id;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private String phoneNumber;
    @Lob
    @Column (name = "photo_identity", columnDefinition="LONGBLOB")
    private byte[] photo_identity;

    private String usernameVendor;
    private String phoneBusiness;
    private String address;
    @Lob
    @Column (name = "photo", columnDefinition="LONGBLOB")
    private byte[] photo;
    private String description;
    private String[] inoperative_date;
    private String instagram_url;
    private float rating;
    private String status;
    private Time startTime;
    private Time endTime;
    private String flag;
    private String bankAccount;
    private String email;
    private String password;
    private String status_reject;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
    @OneToMany(fetch = FetchType.LAZY, mappedBy="vendor", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    public List<CategoryVendor> categoryVendors;

    @JsonIgnore
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class , property = "id")
    @OneToMany(fetch = FetchType.LAZY, mappedBy="vendor", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    public List<Product> product;

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
