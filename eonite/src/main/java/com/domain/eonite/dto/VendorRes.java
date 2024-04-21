package com.domain.eonite.dto;
import java.sql.Time;
import java.util.Date;
import java.util.List;

import com.domain.eonite.entity.Vendor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VendorRes {
    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private List<Vendor> vendor;
    private List<Integer> subCategory;
    private Integer id;
    private String role;
    private Integer domicile_id;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private String phoneNumber;
    private byte[] photo_identity;
    private String usernameVendor;
    private String phoneBusiness;
    private String address;
    private byte[] photo;
    private String description;
    private String[] inoperative_date;
    private String instagram_url;
    private Integer rating;
    private String status;
    private Time startTime;
    private Time endTime;
    private String email;
    private String bankAccount;
    private String bankName;
    private String bankType;
    private String password;
    private String status_reject;
    private Long length;
}
