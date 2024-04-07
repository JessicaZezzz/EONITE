package com.domain.eonite.dto;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TokenRes {
    private int statusCode;
    private String error;
    private String message;
    private String confirmationToken;
    private String userType;
    private String email;
    private Date createdDate;
}