package com.domain.eonite.dto;

import java.util.List;

import com.domain.eonite.entity.Photo;
import com.domain.eonite.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private Integer vendorId;
    private String name;
    private Integer price;
    private String description;
    private Integer capacity;
    private Float rating;
    private List<byte[]> photo;
    private List<Product> products;
}
