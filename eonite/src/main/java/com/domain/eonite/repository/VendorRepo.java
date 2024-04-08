package com.domain.eonite.repository;

import com.domain.eonite.entity.Vendor;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;;

public interface VendorRepo extends JpaRepository<Vendor, Integer>,JpaSpecificationExecutor<Vendor> {
    
    Optional<Vendor> findByEmail(String email);

    List<Vendor> findAllByStatus(String string);
}
