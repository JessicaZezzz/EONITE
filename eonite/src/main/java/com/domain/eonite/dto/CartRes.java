package com.domain.eonite.dto;
import java.util.List;

import com.domain.eonite.entity.Cart;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Tuple;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartRes {
    private int statusCode;
    private String error;
    private String message;
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String bookdate;
    private Integer quantity;
    private List<Integer> deletes;
    private List<Cart> cart;
    private List<CartItem> cartItems;
}
