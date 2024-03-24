package com.domain.eonite.repository;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.domain.eonite.entity.Vendor;

public class VendorSpecs {

    public static Specification<Vendor> vendorsearch(String search) {
      return (root, query, builder) -> 
           search == null ? 
               builder.conjunction() :
               builder.like(root.get("usernameVendor") ,"%"+search.toLowerCase()+"%");
    }

    public static Specification<Vendor> vendordomicile(Integer domicileId) {
      return (root, query, builder) -> 
      domicileId == null ? 
               builder.conjunction() :
               builder.equal(root.get("domicile_id"), domicileId);
    }

    public static Specification<Vendor> vendorstatus(List<String> status) {
      return (root, query, builder) -> 
      status == null ? 
               builder.conjunction() :
               root.get("status").in(status).not();
    }

    public static Specification<Vendor> vendorCategory(List<Integer> category) {
      return (root, query, builder) -> 
      category == null ? 
               builder.conjunction() :
               root.get("categoryVendors").get("subcategory").get("id").in(category);
    }

    public static Specification<Vendor> distinctvendorCategory(List<Integer> category) {
      return (root, query, builder) -> {
        query.distinct(true);
        return vendorCategory(category).toPredicate(root, query, builder);
      };     
    }

    public static Specification<Vendor> ratinglessThan(Integer rating) {
      return (root, query, builder) -> 
           rating == null ? 
               builder.conjunction() :
               builder.lessThanOrEqualTo(root.get("rating"), rating);
    }
}