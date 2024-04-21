package com.domain.eonite.entity;

import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "FundTransaction")
public class FundTransaction {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String rejectedBy;
    private String alasanRejected;
    private Date timestamp;
    private String bankAccountUser;
    private String bankNameUser;
    private String bankTypeUser;
    private String state;
    private Double totalFundUser;
    private Double totalFundVendor;
    @Lob
    @Column (name = "tfUser", columnDefinition="LONGBLOB")
    private byte[] tfUser;
    @Lob
    @Column (name = "tfVendor", columnDefinition="LONGBLOB")
    private byte[] tfVendor;
    private Integer transId;
    private Integer userId;
    private Integer vendorId;
}
