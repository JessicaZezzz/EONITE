package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.FundTransaction;

public interface FundTransRepo extends JpaRepository<FundTransaction,Integer> {
    
}
