package com.example.chateonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.chateonite.entity.ChatRoom;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.Tuple;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Integer>{
    Optional<ChatRoom> findByVendorIdAndUserId(Integer vendorId, Integer userId);

    @Query(value="SELECT cr.id, cr.chat_id, cr.vendor_id, cr.user_id,u.first_name,u.last_name,u.photo,v.username_vendor,v.photo FROM chat_room cr JOIN vendor v ON cr.vendor_id = v.id JOIN user u ON u.id = cr.user_id WHERE cr.vendor_id = :id",nativeQuery=true)
    List<Tuple> findByVendorId(@Param("id") Integer id);

    @Query(value="SELECT cr.id, cr.chat_id, cr.vendor_id, cr.user_id,u.first_name,u.last_name,u.photo,v.username_vendor,v.photo FROM chat_room cr JOIN vendor v ON cr.vendor_id = v.id JOIN user u ON u.id = cr.user_id WHERE cr.user_id= :id",nativeQuery=true)
    List<Tuple> findByUserId(@Param("id") Integer id);

    @Query(value="SELECT cr.id, cr.chat_id, cr.vendor_id, cr.user_id,u.first_name,u.last_name,u.photo,v.username_vendor,v.photo FROM chat_room cr JOIN vendor v ON cr.vendor_id = v.id JOIN user u ON u.id = cr.user_id WHERE cr.user_id= :userId AND cr.vendor_id = :vendorId",nativeQuery=true)
    List<Tuple> findByVendorAndUser(@Param("vendorId") Integer vendorId,@Param("userId") Integer userId);

    @Modifying
    @Query(value="DELETE from chat_room where user_id =:senderId and vendor_id =:recipientId",nativeQuery=true)
    void deleteChatroom(@Param("senderId") Integer senderId,@Param("recipientId") Integer recipientId);
}
