package com.domain.eonite.entity;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private Date transdate;
    private Integer total;
    private String state;
    private String description;
    private String invoice;

    @ManyToOne(optional=true)
    @JoinColumn(name="user_id")
    private Users user;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="vendor_id")
    private Vendor vendor;

    @OneToOne(fetch = FetchType.LAZY, mappedBy="transaction", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    public Payment payment;

    @OneToMany(fetch = FetchType.LAZY, mappedBy="transaction", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    public List<TransactionDetail> transDet;
}
