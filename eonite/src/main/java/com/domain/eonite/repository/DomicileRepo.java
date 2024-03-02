package com.domain.eonite.repository;

import com.domain.eonite.entity.Domicile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DomicileRepo extends JpaRepository<Domicile, Integer> {
    List<Domicile> findAllByOrderByName();
}
