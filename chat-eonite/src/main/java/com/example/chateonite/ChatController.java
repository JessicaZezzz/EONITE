package com.example.chateonite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.chateonite.entity.ChatMessage;
import com.example.chateonite.service.ChatMessageService;
import com.example.chateonite.service.ChatRoomService;

@Controller
@CrossOrigin("*")
public class ChatController {
    @Autowired private ChatMessageService chatMessageService;
    @Autowired private ChatRoomService chatRoomService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendmsg")
    @SendTo("/chat/messages")
    public ChatMessage processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage saved = chatMessageService.save(chatMessage);
        return saved;
    }

    @GetMapping("/messages/{senderId}/{recipientId}/count")
    public ResponseEntity<Long> countNewMessages(
            @PathVariable Integer senderId,
            @PathVariable Integer recipientId) {

        return ResponseEntity
                .ok(chatMessageService.countNewMessages(senderId, recipientId));
    }

    @GetMapping("/messages/{vendorId}/{userId}/{type}")
    public ResponseEntity<?> findChatMessages ( @PathVariable Integer vendorId,
                                                @PathVariable Integer userId,
                                                @PathVariable String type) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(vendorId, userId,type));
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<?> findMessage ( @PathVariable Integer id) {
        return ResponseEntity
                .ok(chatMessageService.findById(id));
    }

    @GetMapping("/messages-vendor/{vendorId}")
    public ResponseEntity<?> findMessageVendor ( @PathVariable Integer vendorId) {
        return ResponseEntity
                .ok(chatRoomService.findByVendorId(vendorId));
    }

    @GetMapping("/messages-user/{userId}")
    public ResponseEntity<?> findMessageUser ( @PathVariable Integer userId) {
        return ResponseEntity
                .ok(chatRoomService.findByUserId(userId));
    }

    @GetMapping("/chatroom/{vendorId}/{userId}")
    public ResponseEntity<?> getChatRoom ( @PathVariable Integer vendorId,@PathVariable Integer userId) {
        return ResponseEntity
                .ok(chatRoomService.getChatRoom(vendorId, userId));
    }

    @GetMapping("/notif/{chatId}")
    public ResponseEntity<?> getNotif ( @PathVariable String chatId) {
        return ResponseEntity
                .ok(chatMessageService.findNotification(chatId));
    }

    @GetMapping("/delchatroom/{vendorId}/{userId}")
    public void deleteChatRoom (@PathVariable Integer vendorId,@PathVariable Integer userId) {
        // return ResponseEntity
        //         .ok(chatRoomService.delChatRoom(vendorId, userId));
        chatRoomService.delChatRoom(vendorId, userId);
        ChatMessage cm = new ChatMessage();
        messagingTemplate.convertAndSend("/chat/messages",cm);
    }
    
}
