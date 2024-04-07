package com.domain.eonite.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.ProductReview;

public interface ProductReviewRepo extends JpaRepository<ProductReview, Integer> {

    List<ProductReview> findAllByProductId(Integer id);

    List<ProductReview> findFirst6ByOrderByRatingDesc();
}
