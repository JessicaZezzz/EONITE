package com.domain.eonite.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "Bank")
public class Bank {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Lob
    @Column (name = "image", columnDefinition="BLOB")
    private byte[] image;
}
