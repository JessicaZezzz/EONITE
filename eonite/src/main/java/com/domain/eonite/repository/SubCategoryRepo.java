package com.domain.eonite.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.domain.eonite.entity.SubCategory;

public interface SubCategoryRepo extends JpaRepository<SubCategory,Integer> {

    @Query(value="SELECT sc.name as name from category_vendor cv JOIN sub_category sc ON cv.subcategory_id = sc.id where cv.id = :id",nativeQuery = true)
    Optional<Object> getCategory(@Param("id") Integer id);

    @Query(value="SELECT cv.subcategory_id from category_vendor cv where cv.vendor_id = :id",nativeQuery = true)
    List<Object> getCategoryId(@Param("id") Integer id);
}