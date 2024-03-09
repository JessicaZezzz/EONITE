package com.domain.eonite.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "BankAccount")
public class BankAccount {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private Integer noAccount;

}
