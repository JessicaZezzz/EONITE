package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.domain.eonite.entity.Product;

public class ProductSpecs {
    public static Specification<Product> ProductVendorId(Integer id) {
        return (root, query, builder) -> 
             id == null ? 
                 builder.conjunction() :
                 builder.equal(root.get("vendor").get("id"),id);
    }

    public static Specification<Product> Productsearch(String search) {
      return (root, query, builder) -> 
           search == null ? 
               builder.conjunction() :
               builder.like(root.get("name") ,"%"+search.toLowerCase()+"%");
    }

    public static Specification<Product> ProductPricemin(Integer min) {
      return (root, query, builder) -> 
      min == null ? 
               builder.conjunction() :
               builder.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> ProductPricemax(Integer max) {
        return (root, query, builder) -> 
        max == null ? 
                builder.conjunction() :
                builder.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Product> ratinglessThan(Integer rating) {
      return (root, query, builder) -> 
           rating == null ? 
               builder.conjunction() :
               builder.lessThanOrEqualTo(root.get("rating"), rating);
    }

    public static Specification<Product> categoryId(List<Integer> id) {
        return (root, query, builder) -> 
            id == null ? 
                builder.conjunction() :
                root.get("categoryid").in(id);
      }
}
