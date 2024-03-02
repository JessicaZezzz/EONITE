package com.domain.eonite.dto;

import java.util.Date;
import com.domain.eonite.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserRes {
    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String role;
    private String first_name;
    private String last_name;
    private Date birth_date;
    private String phone_number;
    private Integer photo_id;
    private String email;
    private String password;
    private Users users;
}
