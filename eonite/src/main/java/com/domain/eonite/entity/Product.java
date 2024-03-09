package com.domain.eonite.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="Product")
public class Product {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer price;
    private String description;
    private Integer capacity;
    private Float rating;

}
