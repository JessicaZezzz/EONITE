package com.domain.eonite.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Integer>{
    List<Product> findAllById(Integer id);
    List<Product> findAllByVendorId(Integer id);
}
