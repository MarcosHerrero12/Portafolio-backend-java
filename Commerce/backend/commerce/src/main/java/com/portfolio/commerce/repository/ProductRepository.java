package com.portfolio.commerce.repository;

import com.portfolio.commerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> searchProducts(
            String name, 
            Long categoryId, 
            java.math.BigDecimal minPrice, 
            java.math.BigDecimal maxPrice
    );

    List<Product> findBySellerId(Long sellerId);
}
