package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.TransactionDetail;

public interface TransactionDetailRepo extends JpaRepository<TransactionDetail,Integer> {
    
}
