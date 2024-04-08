package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.domain.eonite.entity.Transaction;
import com.domain.eonite.entity.Users;
import com.domain.eonite.entity.Vendor;

public interface TransactionRepo extends JpaRepository<Transaction,Integer> {
    List<Transaction> findByUserAndState(Users user, String state);
    List<Transaction> findByVendorAndState(Vendor vendor, String state);
    List<Transaction> findByUser(Users users);
    List<Transaction> findByVendor(Vendor vendor);
    List<Transaction> findAllByState(String string);

    @Query(value="SELECT COUNT(*) FROM transaction WHERE vendor_id=:id and state='WAITING-CONFIRMATION'",nativeQuery=true)
    Long countRequestTransaction(Integer id);

    @Query(value="SELECT COUNT(*) FROM transaction t WHERE t.vendor_id=:id AND t.state='COMPLETED' AND MONTH(t.transdate) =:month",nativeQuery=true)
    Long countTransactionCompleted(Integer id, Integer month);

    @Query(value="SELECT COUNT(*) FROM transaction t WHERE t.vendor_id=:id AND t.state='CANCELLED' AND MONTH(t.transdate) =:month",nativeQuery=true)
    Long countTransactionCancelled(Integer id, Integer month);

}
