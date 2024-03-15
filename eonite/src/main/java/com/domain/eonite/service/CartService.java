package com.domain.eonite.service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.eonite.dto.CartItem;
import com.domain.eonite.dto.CartRes;
import com.domain.eonite.entity.Cart;
import com.domain.eonite.repository.CartRepo;
import com.domain.eonite.repository.ProductRepo;
import com.domain.eonite.repository.UserRepo;

import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class CartService {
    @Autowired
    private CartRepo cartRepository;

    @Autowired 
    private ProductRepo productRepository;

    @Autowired
    private UserRepo userRepository;

    public CartRes addCart(CartRes request){
        CartRes resp = new CartRes();
        userRepository.findById(request.getUserId()).ifPresentOrElse((User)->{
            productRepository.findById(request.getProductId()).ifPresentOrElse((Product)->{
                Cart cart = new Cart();
                cart.setBookdate(request.getBookdate());
                cart.setQuantity(request.getQuantity());
                cart.setProduct(Product);
                cart.setUser(User);
                cartRepository.save(cart);
                List<Cart> carts = new ArrayList<Cart>();
                carts.add(cart);
                try{
                    resp.setCart(carts);
                    resp.setMessage("Success Add Cart");
                    resp.setStatusCode(200);
        
                }catch(Exception e){
                    resp.setStatusCode(500);
                    resp.setError(e.getMessage());
                }
            },null);
        },()->{
            resp.setStatusCode(500);
            resp.setError("User Not Found");
        });
        return resp;
    }

    public CartRes updateCart(CartRes request){
        CartRes resp = new CartRes();
        cartRepository.findById(request.getId()).ifPresentOrElse((cart)->{
            cart.setBookdate(request.getBookdate());
            cart.setQuantity(request.getQuantity());
            cartRepository.save(cart);
            try{
                resp.setMessage("Success Update Cart");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("Cart Not Found"); 
        });
        return resp;
    }

    public CartRes deleteCart(CartRes request){
        CartRes resp = new CartRes();
        for(Integer index : request.getDeletes()){
            cartRepository.findById(index).ifPresentOrElse((cart)->{
                cartRepository.deleteById(index);
            },()->{
                resp.setStatusCode(500);
                resp.setError("cart No Found");
            });
        }
        try{
            resp.setMessage("Success Delete Cart");
            resp.setStatusCode(200);

        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public CartRes getCart(Integer id){
        CartRes resp = new CartRes();
        userRepository.findById(id).ifPresentOrElse((user)->{
            List<Tuple> list = cartRepository.getCartUser(5);
            List<CartItem> cartList = list.stream().map(c-> new CartItem(
                c.get(0,Integer.class),
                c.get(1,String.class),
                c.get(2,Integer.class),
                c.get(3,Integer.class),
                c.get(4,String.class),
                c.get(5,Integer.class),
                c.get(6,Float.class),
                c.get(7,Integer.class),
                c.get(8,String.class),
                (byte[]) c.get(9)
            )).collect(Collectors.toList());
            
            try{
                resp.setCartItems(cartList);
                resp.setMessage("Success Get Cart");
                resp.setStatusCode(200);
    
            }catch(Exception e){
                resp.setStatusCode(500);
                resp.setError(e.getMessage());
            }
        }, ()->{
            resp.setStatusCode(500);
            resp.setError("User Not Found");
        });
        return resp;
    }
}
