package com.domain.eonite.dto;
import com.domain.eonite.entity.Transaction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FundTransRes {
    private Integer id;
    private String rejectedBy;
    private String alasanRejected;
    private Date timestamp;
    private String bankAccountUser;
    private String state;
    private Double totalFundUser;
    private Double totalFundVendor;
    private byte[] tfUser;
    private byte[] tfVendor;
    private Transaction transaction;
}
