package com.domain.eonite.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "Photo")
public class Photo {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    
    @Lob
    @Column (name = "image", columnDefinition="BLOB")
    private byte[] image;

}
