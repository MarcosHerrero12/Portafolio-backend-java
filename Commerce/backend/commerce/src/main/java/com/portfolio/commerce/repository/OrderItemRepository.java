package com.portfolio.commerce.repository;

import com.portfolio.commerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.seller.id = :sellerId AND oi.order.status = 'PAID'")
    List<OrderItem> findPaidItemsBySeller(@Param("sellerId") Long sellerId);
}
