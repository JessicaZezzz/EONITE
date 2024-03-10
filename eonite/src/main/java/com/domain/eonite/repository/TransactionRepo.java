package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.Transaction;

public interface TransactionRepo extends JpaRepository<Transaction,Integer> {
    
}
