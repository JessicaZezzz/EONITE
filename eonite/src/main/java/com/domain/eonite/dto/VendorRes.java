package com.domain.eonite.dto;
import java.sql.Time;
import java.util.Date;

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
    private Vendor vendor;
}
