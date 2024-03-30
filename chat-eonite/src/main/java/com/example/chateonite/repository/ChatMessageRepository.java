package com.example.chateonite.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.chateonite.entity.ChatMessage;
import com.example.chateonite.entity.MessageStatus;
import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Integer> {
    long countBySenderIdAndRecipientIdAndStatus(Integer senderId, Integer recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);
    
    @Modifying
    @Query(value="UPDATE chat_message SET status=:status where chat_id =:chatId",nativeQuery=true)
    void updateStatuses(@Param("chatId") String chatId,@Param("status") MessageStatus status);

    List<ChatMessage> findByChatIdOrderByTimestampAsc(String chatId);

    @Modifying
    @Query(value="DELETE from chat_message where chat_id =:chatId",nativeQuery=true)
    void deleteChatmessage(@Param("chatId") String chatId);

    @Query(value="SELECT * FROM chat_message cm WHERE cm.chat_id=:chatId AND cm.timestamp=(SELECT MAX(timestamp) from chat_message cm0 WHERE cm0.chat_id =:chatId) ",nativeQuery=true)
    Optional<ChatMessage> findNotification(@Param("chatId") String chatId);

    @Query(value="SELECT COUNT(*) FROM chat_message cm WHERE cm.chat_id=:chatId AND cm.status=1",nativeQuery=true)
    Integer findTotalNotif(@Param("chatId") String chatId);
}
