package com.example.chateonite.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chateonite.entity.ChatRoom;
import com.example.chateonite.repository.ChatMessageRepository;
import com.example.chateonite.repository.ChatRoomDTO;
import com.example.chateonite.repository.ChatRoomRepository;
import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatRoomService {
    @Autowired private ChatRoomRepository chatRoomRepository;
    @Autowired private ChatMessageRepository chatMessageRepository;

    private String chatId;
    public String getChatId(Integer vendorId, Integer userId, boolean createIfNotExist) {
        chatRoomRepository.findByVendorIdAndUserId(vendorId, userId).ifPresentOrElse((chat)->{
                chatId = chat.getChatId();
        }, ()->{
                var chatRoomId = String.format("%s_%s",vendorId,userId);
                ChatRoom senderRecipient = new ChatRoom();
                senderRecipient.setChatId(chatRoomId);
                senderRecipient.setUserId(userId);
                senderRecipient.setVendorId(vendorId);
                chatRoomRepository.save(senderRecipient);
                chatId = chatRoomId;
         });
         return chatId;
    }

    public boolean delChatRoom(Integer vendorId, Integer userId){
        var chatId = chatRoomRepository.findByVendorIdAndUserId(vendorId, userId).get().getChatId();
        System.out.println(chatId);
        chatRoomRepository.deleteChatroom(userId,vendorId);
        chatMessageRepository.deleteChatmessage(chatId);
        return true;
    }

    public List<ChatRoomDTO> getChatRoom(Integer vendorId, Integer userId) {
        List<Tuple> result = chatRoomRepository.findByVendorAndUser(vendorId, userId);
        List<ChatRoomDTO> chatRoomDTOs = result.stream().map(c-> new ChatRoomDTO(
                c.get(0,Integer.class),
                c.get(1,String.class),
                c.get(2,Integer.class),
                c.get(3,Integer.class),
                c.get(4,String.class),
                c.get(5,String.class),
                (byte[]) c.get(6),
                c.get(7,String.class),
                (byte[]) c.get(8)
         )).collect(Collectors.toList());
        return chatRoomDTOs;
    }

    public List<ChatRoomDTO> findByVendorId(Integer id) {
        List<Tuple> result = chatRoomRepository.findByVendorId(id);
        List<ChatRoomDTO> chatRoomDTOs = result.stream().map(c-> new ChatRoomDTO(
                c.get(0,Integer.class),
                c.get(1,String.class),
                c.get(2,Integer.class),
                c.get(3,Integer.class),
                c.get(4,String.class),
                c.get(5,String.class),
                (byte[]) c.get(6),
                c.get(7,String.class),
                (byte[]) c.get(8)
         )).collect(Collectors.toList());
        return chatRoomDTOs;

    }

    public List<?> findByUserId(Integer id) {
        List<Tuple> result = chatRoomRepository.findByUserId(id);
        List<ChatRoomDTO> chatRoomDTOs = result.stream().map(c-> new ChatRoomDTO(
                c.get(0,Integer.class),
                c.get(1,String.class),
                c.get(2,Integer.class),
                c.get(3,Integer.class),
                c.get(4,String.class),
                c.get(5,String.class),
                (byte[]) c.get(6),
                c.get(7,String.class),
                (byte[]) c.get(8)
         )).collect(Collectors.toList());
        return chatRoomDTOs;
    }
}
