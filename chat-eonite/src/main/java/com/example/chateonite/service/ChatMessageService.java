package com.example.chateonite.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.chateonite.entity.ChatMessage;
import com.example.chateonite.entity.MessageStatus;
import com.example.chateonite.repository.ChatMessageRepository;
import com.example.chateonite.repository.ChatNotification;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ChatMessageService {
    @Autowired private ChatMessageRepository repository;
    @Autowired private ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        chatMessage.setStatus(MessageStatus.DELIVERED);
        repository.save(chatMessage);        
        return chatMessage;
    }

    public long countNewMessages(Integer senderId, Integer recipientId) {
        return repository.countBySenderIdAndRecipientIdAndStatus(senderId, recipientId, MessageStatus.RECEIVED);
    }

    public List<ChatMessage> findChatMessages(Integer vendorId, Integer userId, String userType) {
        String chatId = chatRoomService.getChatId(vendorId, userId, false);
        List<ChatMessage> messages = repository.findByChatIdOrderByTimestampAsc(chatId);
        
        if(messages.size() > 0) {
            Optional<ChatMessage> cm = repository.findNotification(chatId);
            if(cm.get().getRecipientType().trim().equals(userType.trim())){
                repository.updateStatuses(chatId, MessageStatus.RECEIVED);
            } 
        }
        return messages;
    }

    public ChatNotification findNotification(String chatId){
        ChatNotification notification = new ChatNotification();
        Optional<ChatMessage> cm = repository.findNotification(chatId);
        notification.setChatId(chatId);
        notification.setMessage(cm.get().getContent());
        notification.setRecType(cm.get().getRecipientType());
        notification.setTotal(repository.findTotalNotif(chatId));
        return notification;
    }

    public ChatMessage findById(Integer id) {
        return repository
                .findById(id)
                .map(chatMessage -> {
                    chatMessage.setStatus(MessageStatus.RECEIVED);
                    return repository.save(chatMessage);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("can't find message (" + id + ")"));
    }

    public void updateStatuses(String chatId, MessageStatus status) {
        repository.updateStatuses(chatId, status);
    }

}

