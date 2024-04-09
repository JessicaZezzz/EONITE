package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.TransactionDetail;

public interface TransactionDetailRepo extends JpaRepository<TransactionDetail,Integer> {

    void deleteAllByProductId(Integer id);

    List<TransactionDetail> findAllByTransactionId(Integer id);
    
}
