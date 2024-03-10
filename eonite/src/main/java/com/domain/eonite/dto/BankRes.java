package com.domain.eonite.dto;

import java.util.List;

import com.domain.eonite.entity.BankAccount;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BankRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private Integer vendorid;
    private Integer idbank;
    private String noAccount;
    private List<BankAccount> bankAccounts;
}
