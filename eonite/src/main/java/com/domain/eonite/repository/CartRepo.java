package com.domain.eonite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.domain.eonite.entity.Cart;
import com.domain.eonite.entity.Users;

import jakarta.persistence.Tuple;

import java.util.List;


public interface CartRepo extends JpaRepository<Cart,Integer> {
    List<Cart> findByUser(Users user);

    @Query(value="SELECT c.id as id, c.bookdate as bookdate, c.quantity as quantity," + 
                "p.id as productId, p.name as productName, p.price as productPrice, p.rating as productRating," + 
                "v.id as vendorId, v.username_vendor as usernameVendor, v.photo as photo " + 
                "FROM cart c join product p on c.product_id = p.id " + 
                "join vendor v on p.vendor_id = v.id " +
                "where c.user_id = :id",nativeQuery = true)
    List<Tuple> getCartUser(@Param("id") Integer id);

    void deleteAllByProductId(Integer id);

}
