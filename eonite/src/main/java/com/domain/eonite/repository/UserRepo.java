package com.domain.eonite.repository;

import com.domain.eonite.entity.Users;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.jdbc.core.JdbcTemplate;

public interface UserRepo extends JpaRepository<Users, Integer> {
    
    String searchBy = "first_name";

    Optional<Users> findByEmail(String email);

    @Query(value = "SELECT * FROM user WHERE role=?1 AND (?2 is null or first_name like %?6%)"+
                    " AND (?3 is null or last_name like %?6%)"+
                    " AND (?4 is null or email like %?6%)"+
                    " AND (?5 is null or phone_number like %?6%)", nativeQuery = true)
    Page<Users> findAll(String role, String firstName,String lastName, String email, String phone,String searchParam, Pageable pageable);
}
