package com.domain.eonite.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private Date date;
    private byte[] image;
    private String state;
    private String description;
    private Integer transId;
    private String bankAccount;
    private String bankName;
    private String bankType;
}
