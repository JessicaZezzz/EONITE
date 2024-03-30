package com.example.chateonite.repository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatRoomDTO {
    private Integer id;
    private String chatId;
    private Integer vendorId;
    private Integer userId;
    private String userfirstName;
    private String userlastName;
    private byte[] userPhoto;
    private String vendorName;
    private byte[] vendorPhoto;
    public ChatRoomDTO(Integer id, String chatId, Integer vendorId, Integer userId, String userfirstName,
            String userlastName, byte[] userPhoto, String vendorName, byte[] vendorPhoto) {
        this.id = id;
        this.chatId = chatId;
        this.vendorId = vendorId;
        this.userId = userId;
        this.userfirstName = userfirstName;
        this.userlastName = userlastName;
        this.userPhoto = userPhoto;
        this.vendorName = vendorName;
        this.vendorPhoto = vendorPhoto;
    }
    
}
