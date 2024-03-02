package com.domain.eonite.repository;

import com.domain.eonite.entity.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Integer> {
    List<Category> findAllByOrderByName();
}
