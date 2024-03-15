package com.domain.eonite.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "Domicile")
public class Domicile {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String name;
}
