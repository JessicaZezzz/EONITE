package com.domain.eonite.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CartItem {
    private Integer id;
    private String bookdate;
    private Integer quantity;
    private Integer productId;
    private Integer vendorId;
    private String usernameVendor;
    private float productRating;
    private Integer productPrice;
    private String productName;
    private Integer productMax;
    private byte[] photo;
    
    public CartItem(Integer id, 
                    String bookdate, 
                    Integer quantity, 
                    Integer productId, 
                    String productName,
                    Integer productPrice,
                    float productRating,
                    Integer productMax,
                    Integer vendorId,
                    String usernameVendor,
                    byte[] photo) {
        this.id = id;
        this.bookdate = bookdate;
        this.quantity = quantity;
        this.productId = productId;
        this.vendorId = vendorId;
        this.usernameVendor = usernameVendor;
        this.productRating = productRating;
        this.productPrice = productPrice;
        this.productName = productName;
        this.productMax = productMax;
        this.photo = photo;
    }

}
