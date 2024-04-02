package com.domain.eonite.entity;

import java.util.Date;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name= "token")
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="token_id")
    private Long tokenId;

    @Column(name="confirmation_token")
    private String confirmationToken;

    private String userType;
    private String email;
    private Date createdDate;
}
