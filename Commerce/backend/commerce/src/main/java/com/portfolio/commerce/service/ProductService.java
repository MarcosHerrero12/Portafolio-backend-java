package com.portfolio.commerce.service;

import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.exception.ResourceNotFoundException;
import com.portfolio.commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> searchProducts(
            String name, 
            Long categoryId, 
            java.math.BigDecimal minPrice, 
            java.math.BigDecimal maxPrice
    ) {
        return productRepository.searchProducts(name, categoryId, minPrice, maxPrice);
    }

    public List<Product> getProductsBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
