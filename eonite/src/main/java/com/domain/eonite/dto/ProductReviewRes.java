package com.domain.eonite.dto;

import java.util.List;
import com.domain.eonite.entity.ProductReview;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductReviewRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private String review;
    private Integer rating;
    private Integer user_id;
    private Integer product_id;
    private Integer transaction_detail_id;
    private List<ProductReview> productReview;
}
