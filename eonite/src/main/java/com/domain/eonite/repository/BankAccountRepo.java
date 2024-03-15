package com.domain.eonite.repository;

import com.domain.eonite.entity.BankAccount;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BankAccountRepo extends JpaRepository<BankAccount, Integer> {
    
    @Query(value="select * from bank_account where vendor_id = :id",nativeQuery = true)
    List<BankAccount> getBankAccount(@Param("id") Integer id);

    @Modifying
    @Query(value="delete from bank_account where id = :id",nativeQuery = true)
    void deleteBankAccount(@Param("id") Integer id);
}
