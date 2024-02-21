package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.domain.eonite.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Integer>{
    
}
