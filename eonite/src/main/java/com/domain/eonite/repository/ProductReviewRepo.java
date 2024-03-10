package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.ProductReview;

public interface ProductReviewRepo extends JpaRepository<ProductReview, Integer> {
    
}
