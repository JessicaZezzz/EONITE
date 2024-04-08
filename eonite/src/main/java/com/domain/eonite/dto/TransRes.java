package com.domain.eonite.dto;
import java.util.Date;
import java.util.List;

import com.domain.eonite.entity.Transaction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private Date transdate;
    private Integer total;
    private String state;
    private String invoice;
    private String description;
    private Integer userId;
    private Integer vendorId;
    private String prevState;
    private String action;
    private List<Integer> cartId;
    private Transaction transaction;
    private List<Transaction> transactions;
    private List<FundTransRes> fundTransactions;
}
