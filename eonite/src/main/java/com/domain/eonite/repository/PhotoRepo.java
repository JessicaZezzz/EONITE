package com.domain.eonite.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.domain.eonite.entity.Photo;

public interface PhotoRepo extends JpaRepository<Photo, Integer>  {

}
