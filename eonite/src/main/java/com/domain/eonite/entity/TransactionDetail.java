package com.domain.eonite.entity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TransactionDetail")
public class TransactionDetail {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String bookdate;
    private Integer quantity;

    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="transaction_id")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @OneToOne(fetch = FetchType.LAZY, mappedBy="transactionDetail", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    private ProductReview productReview;
}
