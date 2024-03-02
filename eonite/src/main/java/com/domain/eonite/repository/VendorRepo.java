package com.domain.eonite.repository;

import com.domain.eonite.entity.Vendor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;;

public interface VendorRepo extends JpaRepository<Vendor, Integer> {
    
    Optional<Vendor> findByEmail(String email);
}
