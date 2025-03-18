package com.example.springboot_product_api.repository;

import com.example.springboot_product_api.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    //custom method
    Product findByName(String name);
}
