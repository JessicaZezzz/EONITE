package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.FundTransaction;

public interface FundTransRepo extends JpaRepository<FundTransaction,Integer> {

	List<FundTransaction> findAllByState(String string);

    List<FundTransaction> findAllByUserId(Integer id);

    List<FundTransaction> findAllByVendorId(Integer id);

    List<FundTransaction> findByTransId(Integer id);
    
}
