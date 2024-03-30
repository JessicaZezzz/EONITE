package com.example.chateonite.entity;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
   private Integer id;
   private String chatId;
   private Integer senderId;
   private Integer recipientId;
   private String senderType;
   private String recipientType;
   private String content;
   private Date timestamp;
   private MessageStatus status;
}
