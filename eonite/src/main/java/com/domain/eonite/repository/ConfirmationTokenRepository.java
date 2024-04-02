package com.domain.eonite.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.ConfirmationToken;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByUserTypeAndEmail(String userType, String email);
    
}
