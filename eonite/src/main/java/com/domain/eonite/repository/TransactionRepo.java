package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.Transaction;
import com.domain.eonite.entity.Users;
import com.domain.eonite.entity.Vendor;

public interface TransactionRepo extends JpaRepository<Transaction,Integer> {
    List<Transaction> findByUserAndState(Users user, String state);
    List<Transaction> findByVendorAndState(Vendor vendor, String state);
    List<Transaction> findByUser(Users users);
    List<Transaction> findByVendor(Vendor vendor);
    List<Transaction> findAllByState(String string);
}
