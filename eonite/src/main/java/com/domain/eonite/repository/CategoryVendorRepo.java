package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.domain.eonite.entity.CategoryVendor;

public interface CategoryVendorRepo extends JpaRepository<CategoryVendor,Integer> {

    @Modifying
    @Query(value="delete from category_vendor where vendor_id = :id",nativeQuery = true)
    void deleteCategoryVendor(@Param("id") Integer id);

    @Query(value="select id from category_vendor where vendor_id = :id",nativeQuery = true)
    Integer[] findByVendorId(@Param("id") Integer id);
}
