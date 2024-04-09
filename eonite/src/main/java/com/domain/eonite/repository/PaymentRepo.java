package com.domain.eonite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.Payment;
import com.domain.eonite.entity.Transaction;

public interface PaymentRepo extends JpaRepository<Payment,Integer> {

    Optional<Payment> findByTransaction(Transaction transaction);

    Optional<Payment> findByTransactionId(Integer id);
    
}
