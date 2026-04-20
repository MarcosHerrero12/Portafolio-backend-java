package com.portfolio.commerce.service;

import com.portfolio.commerce.dto.OrderRequest;
import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.entity.OrderItem;
import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.exception.InsufficientStockException;
import com.portfolio.commerce.exception.ResourceNotFoundException;
import com.portfolio.commerce.repository.OrderRepository;
import com.portfolio.commerce.repository.ProductRepository;
import com.portfolio.commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public Order createOrder(String userEmail, OrderRequest orderRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Not enough stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        // Send confirmation email
        emailService.sendOrderConfirmation(user.getEmail(), savedOrder.getId());
        
        return savedOrder;
    }
    
    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}
