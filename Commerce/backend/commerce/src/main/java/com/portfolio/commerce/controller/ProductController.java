package com.portfolio.commerce.controller;

import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String name,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long categoryId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.math.BigDecimal minPrice,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.math.BigDecimal maxPrice
    ) {
        if (name != null || categoryId != null || minPrice != null || maxPrice != null) {
            return ResponseEntity.ok(productService.searchProducts(name, categoryId, minPrice, maxPrice));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
