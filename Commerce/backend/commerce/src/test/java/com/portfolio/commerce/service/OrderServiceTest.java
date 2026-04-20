package com.portfolio.commerce.service;

import com.portfolio.commerce.dto.OrderItemRequest;
import com.portfolio.commerce.dto.OrderRequest;
import com.portfolio.commerce.entity.Order;
import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.exception.InsufficientStockException;
import com.portfolio.commerce.exception.ResourceNotFoundException;
import com.portfolio.commerce.repository.OrderRepository;
import com.portfolio.commerce.repository.ProductRepository;
import com.portfolio.commerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .name("Test User")
                .build();

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .price(new BigDecimal("100.00"))
                .stock(10)
                .build();
    }

    @Test
    void createOrder_Success() {
        // Arrange
        OrderRequest request = new OrderRequest();
        request.setItems(List.of(new OrderItemRequest(1L, 2)));

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Order createdOrder = orderService.createOrder("test@test.com", request);

        // Assert
        assertNotNull(createdOrder);
        assertEquals(new BigDecimal("200.00"), createdOrder.getTotalAmount());
        assertEquals(8, testProduct.getStock()); // Stock reduced
        assertEquals(1, createdOrder.getItems().size());
        verify(productRepository, times(1)).save(testProduct);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_ThrowsInsufficientStockException() {
        // Arrange
        OrderRequest request = new OrderRequest();
        request.setItems(List.of(new OrderItemRequest(1L, 15))); // Trying to buy more than stock

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act & Assert
        InsufficientStockException exception = assertThrows(InsufficientStockException.class, () -> {
            orderService.createOrder("test@test.com", request);
        });

        assertEquals("Not enough stock for product: Test Product", exception.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_ThrowsResourceNotFoundExceptionForUser() {
        // Arrange
        OrderRequest request = new OrderRequest();

        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            orderService.createOrder("unknown@test.com", request);
        });

        assertEquals("User not found with email: unknown@test.com", exception.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
    }
}
